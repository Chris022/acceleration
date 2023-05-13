class SuccessPage extends AccelerationComponent {
            
    connectedCallback() {
        this.attachShadow({mode:"open"})

        //get the name
        let name = this.props["name"];


        let header = document.createElement("h1");
        header.innerText = `Hello ${name} - Nice to meet you!`;

        this.shadowRoot.appendChild(header)
    }
}
customElements.define("success-page", SuccessPage);