# Acceleration.js

#library #php #js #webcomponents

[Github](https://github.com/Chris022/acceleration) Acceleration is my protocol/system for creating single page web apps. 
It is strongly inspired by [Interiajs](https://inertiajs.com/).

## Documentation

### Introduction
Acceleration is a collection of libraries that act as an interface between the frontend and backend of a web app.
There normally are two ways of creating a web app.

#### 1) Template based
When using a Template based approach, the front and backend normally s a single program written in a language like PHP or node. Whenever a user calls a link, the backend fully generates the HTML and returns it to the user. This often involves using a templating engine like blade. 
The problem with this approach is the tight coupling between your front and backend (since they are actually the same). This makes it difficult to, for example, not only provide a web interface, but also a desktop app and mobile app for your web app.

#### 2) API based
In an API based approach, the backend and frontend are two separate programs. In this case, the backend simply offers an API which can be used by the frontend to get/update/create/delete resources.
This approach makes it super easy to swap out the frontend or have multiple frontends (one as a desktop app, one as a mobile app and so on). However, one downside of this approach is that the fronted programs often are quite complex since they rely on AJAX calls and have to update the displayed data reactively.


#### Acceleration
This is where acceleration comes into play. It combines both approaches whilst only taking the good parts of each.
Essentially, Acceleration allows you to create fully decoupled frontends whilst simulating a Template based approach. Therefore, the complicated state management that normally comes with an API based approach can be avoided whilst still allowing for multiple frontends.

### Installation
[[Acceleration]] consists out of two parts. One library for your frontend and one library for your backend.

#### Backend Library
##### PHP
For PHP it is suggested to use composer. Since, however, this library is NOT on Packagist(although this might change in the future?), it is suggested to simply clone this into a ```/git_vendor``` folder in the root directory of your project.
```bash
git clone https://github.com/Chris022/acceleration.git git_vendor
```

After cloning the repo, add the following lines to your composer.json
```json
"repositories": [
	{
		"type": "path",
		"url": "./git_vendor/acceleration/backend/php/"
	}
]
```

Once done, the library can now be required like usual
```bash
composer require "vendorname/packagename @stable"
```

#### Frontend Library
##### Plain JS (not node)
The JS library can simply be included using script tags. Simply place the following code in the header of your index.html. 
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Chris022/acceleration/frontend/js/src/acceleration.js"></script>

<!-- also include the loader if you want to use it (is not required) -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Chris022/acceleration/frontend/js/src/acceleration-loading.js"></script>
```
**Important:** always include the acceleration files first!



### Usage
In order to get a better understanding of this library, it is highly suggested to take a look at some example applications #Todo GitHub link.

#### Frontend
The frontend part of an [[Acceleration]] application mainly consists out of an `index.html`and a few `.js` files - one for each page of the application.

##### The index.html
The `index.html` can be thought of as a template for all pages. It includes all scripts and styles and has to have a div with the id "main". It can also include a component with the id "loading-element".

```html
<!DOCTYPE html>
<html>
    <head>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Chris022/acceleration/frontend/js/src/acceleration.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/gh/Chris022/acceleration/frontend/js/src/acceleration-loading.js"></script>

		<!-- Include the page-webcomponents -->
		<!-- This part changes from applicatin to application -->
        <script src="/public/js/pages/GreetingsPage.js"></script>
        <script src="/public/js/pages/SuccessPage.js"></script>
        <!-- End -->
    </head>

    <body>
        <bar-loader id="loading-element"></bar-loader>
        <div id="main"></div>
    </body>
</html>
```

This is an example `index.html`. Most of the time it will look pretty much just like this. Except for the part saying "This part changes from application to application".

##### Pages
When using Acceleration, every page is a web component. It is suggested to put every page/component into its own file. These files then have to be included in the `index.html`.
When using web components, every component has its own JS class. This class has to extend the `AccelerationComponent` base class. After creating the class, the component can be registered with the following code: 
```js
customElements.define("<page-name>", <ClassName>);
```
If more Information about creating web components is needed, either check out one of the provided examples our simply search the internet!

###### Example component
```js
class GreetingsPage extends AccelerationComponent {
            
    connectedCallback() {
        this.attachShadow({mode:"open"})

        let header = document.createElement("h1");
        header.innerText = "Hello stranger";

        this.shadowRoot.appendChild(header)
    }
}
customElements.define("greetings-page", GreetingsPage);
```

##### State management
Most of the time, the frontend is used to display some kind of data. In acceleration, this works the following way: The backend returns an array containing the data. This array then can be accessed inside the web component class.  This is done simply by accessing the `this.props` property. 

###### Example for a component using backend data
```js
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
```

##### HTTP Requests
Often an application has to send some data to the backend. (for example, in a webshop the frontend has to send the product name, the user wants to by, to the backend).
These Requests should be made using the provided functions `get`, `post`, `put`, `patch` or `delete`. Each method corresponds to an HTTP request method.  When using forms the function `submit_form` should be used.

###### Example call
```js
function on_buy_button_click(){
	get("/buy",{"product_name":"coffee"})
}
```

###### Example form
```js
function error_handler(errors){
    if(errors.product_name){
        this.shadowRoot.getElementById("product_name-error").innerText = errors.name;
	    this.shadowRoot.getElementById("product_name-error").hidden = false;
    }
}

function on_form_submit(event){
	submit_form(event,"/by-product","POST",error_handler)
}
```



#### Backend
The backend of [[Acceleration]] can be used together with any framework. The only requirement is that there is a possibility to return JSON/HTML data as result of a request. In order to keep the documentation as general as possible, the examples in this document however do NOT use any frameworks

##### Configuring
When using acceleration in the backend, it requires the "ACCELERATION_BASE_VIEW" environment variable to hold the URL of the `index.html` (see [[Acceleration#The index.html]] for more information).
If the used framework does not provide any way to set environment variables, acceleration offers the function `Acceleration::setBaseView($url)`. This function has to be called, every time a request is sent to the backend!

##### Return
After processing the send data, the backend should always return data using either the  `Acceleration::get($component_name,$props)` or the `Acceleration::render($component_name,$props)` function.
**Important:** This function either returns HTML or JSON. The `render` function sets the "Content-type" header based on the returned data. The `get` function simply returns the data, without setting any headers!

###### Example

```php
die(Acceleration::render("success-page",[
	"name" => $name
]));
```
Since this example does not use any framework, it simply uses the `die` function of PHP. This function stops the execution and immediately returns the data. When using a framework, this is not suggested!

##### Validation Errors
When working with forms, there might be some data that has to be validated on the server. In that case, whenever there is a validation error, simply use either the `get` or `render` method, with the component, this form is on (if for example the form is on the page "create-user", this should be the component used when calling these functions) and a property called "errors". The "errors" field should be an array, with the name of the field as the key and the error message as the value.

###### Example

```php
//validate input
if(!!!isset($_POST["name"]) or $_POST["name"]===""){
    die(Acceleration::render("geetings-page",[
        "errors" => [
            "name" => "The field name is required!"
        ]
    ]));
}
``` 

Again, when using a framework, using `die` is not suggested!



### How it works
This Note covers how [[Acceleration]] works internally.

When writing applications using [[Acceleration]] the front and backend are fully decoupled and independent of each other. Acceleration then defines a protocol that both programs use, to exchange data with each other.

#### Single page apps
Since Acceleration powered frontends are "single-page-apps" the backend really only returns the webpage once! All subsequent calls to the backend are just essentially just AJAX calls!
This means Acceleration distinguishes between two different types of backend requests.
1) An initial request, in which case the backend returns a full HTML webpage.
2) Partial requests, in which case the backend simply returns a JSON page object, used by the frontend to display the requested page and data.
The backend uses the "X-Acceleration" Header to decide whether the user requested an initial call or a partial call. If its value is true, it returns just JSON data, otherwise the full webpage is returned.

#### Frontend pages
When using Acceleration, each page the frontend application features is a separate [[Webcomponent]]. (This does not mean that the frontend can't use React or something similar - since any framework can be used to fill the page component with elements)

#### The base view
The base view is the HTML document that is returned whenever an initial request was sent. It has to have a div with the id "main". This is the div that acceleration fills with the requested page web component.
The base view might also have a component with the id "loading-element". This allows to create custom loading elements.
The base view HTML also has to include the acceleration frontend library and all other js files.
The acceleration always has to be able to access the base view. This means it requires the environment variable "ACCELERATION_BASE_VIEW" to hold the url that points to the base view. (most of the time it is called index.html)

#### Backend requests
Whenever the frontend has to send a request to the backend, one of the offered functions `get`, `post`, `put`, `patch` or `delete` can be used. These functions start by displaying the loading element, make a http request and based on the returned JSON object (these functions always fire partial requests) display the correct web component. 

#### From
When working with forms, acceleration offers the `submit_form` function. This function allows passing an "onError" callback along. That way, validation errors can be displayed.

#### Backend program flow
1) An endpoint is called -> for example "https://example.com"
2) The backend does all the required routing, data processing and so on
3) The backend checks whether an initial request or partial request has been sent
4) In case of an initial request it returns the base view (and passes the page object via an x-page attribute on the main div)
5) In case of a partial request it just returns the JSON object.