//@ts-check

/**
 * The function that loads the correct webcomponent based on the response from the backend
 */
function route(){
    let main_div = document.getElementById("main");
    if(!main_div) throw "Acceleration Error: No div with id 'main' found!";

    if(!!!main_div.hasAttribute("x-page")) throw "Acceleration Error: The main div is missing the x-page attribute";
    
    let page_object = JSON.parse(/** @type {string} */ (main_div.getAttribute("x-page")));

    //create a new html element and insert it into the main div
    //the name of the element is the component 
   let webcomponent_name = page_object["component"];

   if(!!!webcomponent_name) throw "Acceleration Error: The page_object does not include a 'page' attribute!";

   /**@type {AccelerationComponent} */
   let component = document.createElement(webcomponent_name);

   //set the props property in the webcomponent
   let props = page_object["props"];
   if(!!!props) throw "Acceleration Error: The page_object does not include a 'props' attribute!";

   component.setProps(props);


   main_div.appendChild(component);    
}

//call the route method once the webpage is loaded
window.addEventListener("DOMContentLoaded",route);



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