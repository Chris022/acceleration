//@ts-check

//---------------------------------- This section listens for events -------------------------------//

//once the website is loaded call the initAcceleration function in order to load the correct webcomponent
window.addEventListener("load", initAcceleration);

//everytime the user hits the back button in his browser, the correct webcomponent has to be loaded again
//this is done by calling the route function with the page object from the page in the history
window.addEventListener("popstate", (event) => {if(event.state) route(event.state,false,true)})

//---------------------------------------------- END ----------------------------------------------//


//-------------------------- This function provieds basic functionality. --------------------------//

/**
 * The function that is called when the page is loaded the first time
 */
function initAcceleration() {
    let main_div = document.getElementById("main");
    if (!main_div) throw "Acceleration Error: No div with id 'main' found!";

    if (!!!main_div.hasAttribute("x-page")) throw "Acceleration Error: The main div is missing the x-page attribute";

    let page_object = JSON.parse(/** @type {string} */(main_div.getAttribute("x-page")));

    route(page_object,true);
}

/**
 * The function that loads the correct webcomponent based on the response from the backend.
 * The back parameter has to be true if the route function is called because the user hit the back button
 * The inital parameter has to be true if the route function is called on the initial page load
 * 
 * @param {object} page_object
 * @param {boolean} back 
 */
function route(page_object, initial=false, back=false) {
    //create a new html element and insert it into the main div
    //the name of the element is the component 
   let webcomponent_name = page_object["component"];

    if (!!!webcomponent_name) throw "Acceleration Error: The page_object does not include a 'component' attribute!";

    //check if the requestet webcomponent is defined
    if(customElements.get(webcomponent_name) === undefined) throw `Acceleration Error: The webcomponent ${webcomponent_name} does not exist!`;

    /**@type {AccelerationComponent} */
    let component = document.createElement(webcomponent_name);

    //set the props property in the webcomponent
    let props = page_object["props"];
    if(!!!props) throw "Acceleration Error: The page_object does not include a 'props' attribute!";

    component.setProps(props);

    //get the main div and set its content
    let main_div = document.getElementById("main");
    if (!main_div) throw "Acceleration Error: No div with id 'main' found!";
    //clear all children
    main_div.innerHTML = "";
    //set the new child
    main_div.appendChild(component);

    //if everything was successfull add the new page to the history
    if(initial) history.replaceState(page_object, "", page_object["url"]); 
    else if(!!!back) history.pushState(page_object, "", page_object["url"]); 

    //hide the loader (if exists)
    let loader = document.getElementById("loading-element");
    if(loader) loader.style.display = "none";
}

//------------------------------------------ END ------------------------------------------//


//- This section provides a base class for creating the Webcomponents that represent the different pages. -


/**
 * The baseclass for all Webcomponents that might be routed by Acceleration
 * @class
 * @constructor
 * @public
 * @abstract
 * 
 * @extends HTMLElement
 */
class AccelerationComponent extends HTMLElement{

    /**
     * This property holds all the data the was passed from the backend to the frontend
     * @type {Object<string,any>}
     * @protected
     */
    props;

    constructor() {
        super();
    }

    /**
     * This function allows to set the props property
     * @param {Object<string,any>} props 
     */
    setProps(props){
        this.props = props;
    }

}
//------------------------------------------ END ------------------------------------------//


//------------This section features functions that can be used to visit new pages----------//

/**
 * This function can be used to call the backend with a post call - this also updates the browser history
 * @param {string} url 
 * @param {object|null} body
 * @param {string} method
 */
function visit(url, body, method) {
    //show the loader (if exists)
    let loader = document.getElementById("loading-element");
    if(loader) loader.style.display = "unset";

    let ret = fetch(
        url,
        {
            "method": method,
            "headers": {
                "X-ACCELERATION": "1"
            },
            "body": body
        }
    )
    ret.then(result => result.json())
        .then(page => route(page))
}

/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function get(url, body){
    visit(url + new URLSearchParams(body), null, "GET");
}
/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function post(url, body){
    visit(url,body,"POST");
}
/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function patch(url, body){
    visit(url,body,"PATCH");
}
/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function put(url, body){
    visit(url,body,"PUT");
}
/**
 * Helper for a specific http method
 * @param {string} url 
 * @param {object} body
 */
function delete_(url, body){
    visit(url,body,"Delete");
}

/**
 * Helper for sending form data to the backend
 * @param {SubmitEvent} event 
 * @param {string} url 
 * @param {string} method 
 * @param {Function} onError
 * 
 * @returns {void}
 */
function submit_form(event, url, method, onError) {
    //show the loader (if exists)
    let loader = document.getElementById("loading-element");
    if (loader) loader.style.display = "unset";

    //get the form component
    let form = /** @type {HTMLFormElement}*/ (event.target);
    let data = new FormData(form);
    let data_array = /** @type {Record<string,string>} */ (Object.fromEntries(data.entries()));

    if (method === "GET") url = url + "?" + new URLSearchParams(data_array)

    let ret = fetch(
        url,
        {
            "method": method,
            "headers": {
                "X-ACCELERATION": "1"
            },
            "body": (method === "GET") ? null : data
        }
    )

    ret.then(result => result.json())
        .then(page => {
            if (page.props.errors) {
                onError(page.props.errors)
                
                //hide the loader (if exists)
                let loader = document.getElementById("loading-element");
                if (loader) loader.style.display = "none";
            } else {
                route(page)
            }
        })
    event.preventDefault();
}
//------------------------------------------ END ------------------------------------------//