//@ts-check

/**
 * This file holds all webcompnents that can be used as a loading element - this file is completely optional.
 * Acceleration will search for a component with the id "loading-element" in your base view. That means the loading element
 *  can easily be changed by swaping out the component with that id
 */

class BarLoader extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.attachShadow({mode:"open"})

        let container = document.createElement("div");
        container.className = "acceleration-loaders-bar";

        let bar1 = document.createElement("div");
        let bar2 = document.createElement("div");
        let bar3 = document.createElement("div");
        let bar4 = document.createElement("div");
        let bar5 = document.createElement("div");
        let bar6 = document.createElement("div");

        container.appendChild(bar1);
        container.appendChild(bar2);
        container.appendChild(bar3);
        container.appendChild(bar4);
        container.appendChild(bar5);
        container.appendChild(bar6);

        this.shadowRoot?.appendChild(container);

        let style = document.createElement("style");
        style.innerText = `
            .acceleration-loaders-bar{
                position: absolute;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0,0,0,0.7);
                top:0;
                left:0;

                display:flex;
                flex-direction: row;
                justify-content:center;
                align-items:center;
            }

            .acceleration-loaders-bar > div{
                height:3px;
                width:12px;
               
                margin:1px;

                animation-name: bar;
                animation-duration: 1s;
                animation-iteration-count: infinite;
            }

            .acceleration-loaders-bar div:nth-child(1) {
                animation-delay: 0s;
                background-color: #754fa0;
            }
            .acceleration-loaders-bar div:nth-child(2) {
                animation-delay: 0.1s;
                background-color: #09b7bf;
            }
            .acceleration-loaders-bar div:nth-child(3) {
                animation-delay: 0.2s;
                background-color: #90d36b;
            }
            .acceleration-loaders-bar div:nth-child(4) {
                animation-delay: 0.3s;
                background-color: #f2d40d;
            }
            .acceleration-loaders-bar div:nth-child(5) {
                animation-delay: 0.4s;
                background-color: #fcb12b;
            }
            .acceleration-loaders-bar div:nth-child(6) {
                animation-delay: 0.5s;
                background-color: #ed1b72;
            }


            @keyframes bar {
                0% {height:3px;}
                20% {height:60px;}
                40% {height:3px;}
            }
        
        `;
        this.shadowRoot?.appendChild(style);
    }
}
customElements.define("bar-loader", BarLoader);