// write a native web component that renders a proposal card for each issue
// fetch the data from the Github Issues API
// https://developer.github.com/v3/issues/#list-issues-for-a-repository

class ProposalCards extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.proposalData = [];
  }

  connectedCallback() {
    this.fetchIssues()
      .then(() => {
        this.filterOutPullRequests();
        this.render();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // fetch the data from the Github Issues API
  async fetchIssues() {
    const response = await fetch(
      "https://api.github.com/repos/CodeYourFuture/Tenders/issues"
    );
    const data = await response.json();
    this.proposalData = data; // set the proposalData property with the fetched data
  }

  filterOutPullRequests() {
    this.proposalData.length
      ? (this.proposalData = this.proposalData.filter((issue) => {
          return issue.pull_request === undefined;
        }))
      : null;
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
    section {
      padding: 0 var(--gap) var(--gap);
      word-break: break-word;
      border: .25px solid var(--paper);
      box-shadow: 0 0 10px 0 var(--paper);
      transition: transform 0.2s ease-in-out;
      display: grid;
      align-content: space-between;
    }
    a, a:any-link {
        color: var(--ink);
        text-decoration: none;
      }
    section:hover, section:focus-within {
      
        box-shadow: 0 0 15px 0 var(--paper);
        transform: scale(1.01) translate3d(0, 0, -10px);
      }
      ul, li {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      ul {
        display: flex;
        flex-flow: row wrap;
        gap: calc(var(--gap) /2 );
      }
      li a, li a:any-link {
        display:block;
        text-decoration: none;
        background: var(--github);
        color: var(--label);
        font-size:smaller;
        font-weight: bolder;
        border: 1px solid var(--label);
        border-radius: 1em;
        padding: 0.125em 0.5em;
        filter: brightness(1.5);
        
      }
      </style>
        ${this.proposalData
          .map(
            (proposal) => `
        <section id="id_${proposal.id}">
          <a href="${proposal.html_url}"><h2>${proposal.title}</h2>
          <p>${
            proposal.body ? proposal.body.substring(0, 140) : "Read more"
          }...</p>
          </a>
          ${
            proposal.labels.length
              ? `<ul>
            ${proposal.labels
              .map(
                (label) => `
              <li style="--label:#${label.color}">
                <a href="https://github.com/CodeYourFuture/Changes/labels/${label.name}">${label.name}</a>
              </li>
            `
              )
              .join("")}
          </ul>`
              : ""
          }
        </section>
      `
          )
          .join("")}
        `;
  }
}

customElements.define("proposal-cards", ProposalCards);
