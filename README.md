# Spring 3.1 and Backbone.js integration sample - Todo List

This is a sample application presenting integration of
[Backbone.js](http://documentcloud.github.com/backbone/) with
[Spring Framework 31](http://www.springsource.org/). This application
wasn't intended to provide fully-fledged TODO list. It's goal was to
present some new features introduced in Spring 3.1 and integration
with Backbone.js.

Features that this sample covers:

* Java-based configuration (Servlet 3.0 based web-application and
persistence layer backed by JPA and Spring Data JPA)
* Request body validation and exception handling
* Improvements in RESTful web services (produces and consumes).

## Running the Application

The application is Servlet 3.0 standard application, so it need to be
deployed to Servlet 3.0 compatible environment (Application was tested on
Tomcat 7).

*The application needs to be deployed as context root*. This
 application serves static content (like CSS, JS files) from static
 `index.html` file therefore it doesn't dynamically update URL's for
 static content. Also Backbone's models and collections needs to have
 `url` property to be set and the `todo-list.js` file is also
 static. That's why for this particular application URL's for static
 content and API calls were hardcoded for application running as
 context-root ('/').

If you do not want to run this application as context-root you need to
change URL's to static content in `index.html` file and you need to
change `url` property for Backbone's API calls for `Task` model and
`Tasks` collection in `todo-list.js` file.

## Troubleshooting

Whenever you encounter any problems with this application (or any
other Backbone application) open browser's JS console and verify there
is no JS errors. Also check if everything - HTML page, static CSS and
JS file - were correctly downloaded and you do not receiving 404 for
any of these resource. You can check this in Network/Net tab in Chrome
or Firebug.

If everything seems to be loaded and no JS console doesn't show any
errors you should be able to create Backbone models or collections in
the console. For example you can try the following:

```javascript
> task = new Task({description: 'Desc'})
child
> task.get('description')
"Desc"
```

Whenever something goes wrong on the page go to the console and watch
for JS error.

In general it is very good idea to get familiar with your browser's JS
console while you will use it a lot for debugging.
