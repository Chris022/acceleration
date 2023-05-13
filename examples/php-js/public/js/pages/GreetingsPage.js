class GreetingsPage extends AccelerationComponent {
            
    connectedCallback() {
        this.attachShadow({mode:"open"})

        let header = document.createElement("h1");
        header.innerText = "Hello stranger - Please enter your name below";

        let form_element = document.createElement("form");
        form_element.innerHTML = `
            <label id="name-error" hidden="true"></label>
            <input type="text" name="name"/>
            <input type="submit"/>
        `

        let error_handler = (errors) => {
            if(errors.name){
                this.shadowRoot.getElementById("name-error").innerText = errors.name;
                this.shadowRoot.getElementById("name-error").hidden = false;
            }
        }

        form_element.addEventListener("submit",(event)=>{
            submit_form(event,"","POST",error_handler)
        })

        this.shadowRoot.appendChild(header)
        this.shadowRoot.appendChild(form_element)
    }
}
customElements.define("greetings-page", GreetingsPage);