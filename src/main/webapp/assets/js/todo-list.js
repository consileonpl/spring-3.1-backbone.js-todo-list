$(function() {

    window.notices = $("#notices");

    // Represents single task
    window.Task = Backbone.Model.extend({
        url: "/api/v1/tasks",

        description: function() {
            return this.get('description');
        }
    });

    // Represents collection of tasks
    window.Tasks = Backbone.Collection.extend({
        model: Task,
        url: "/api/v1/tasks"
    });

    window.tasks = new Tasks();

    // View responsible for rendering tasks list
    window.TasksView = Backbone.View.extend({
        tagName: 'section',

        initialize: function() {
            // Bind render method to this object
            _.bindAll(this, 'render');

            // Get the template that will be rendered
            this.template = _.template($('#tasks-template').html());

            // Bind invocation of render if the 'reset' event
            // on tasks collection is raised
            this.collection.on('add', this.render, this);
            this.collection.on('reset', this.render, this);

            // Fetch data from the backend
            this.collection.fetch();
        },

        render: function() {
            console.log("Render TasksView");
            $(this.el).html(this.template({
                tasks: this.collection.toJSON()
            }));
            $("#tasks").sortable();
            return this;
        }
    });

    // View responsible for the overall layout. Main purpose of
    // this view is to render all subviews and bind to certain
    // events on view (like creating new task). This view is
    // not rendered from the template. It bounds itself to
    // existing view's body, and register event listeners.
    window.HomeView = Backbone.View.extend({
        // Attach view to the whole body, we do not render template
        // for this view.
        el: $("body"),

        events: {
            "keypress #create-task": "createTask"
        },

        initialize: function() {
            this.tasksView = new TasksView({
                collection: window.tasks
            });
            this.input = $("#create-task");
        },

        render: function() {
            $("#container").empty();
            $("#container").append(this.tasksView.render().el);
            return this;
        },

        createTask: function(e) {
            // Process only on return pressed
            if (e.keyCode == 13) {
                var description = this.input.val();
                // create new task model, save to the backend
                // and add to collection if saved
                tasks.create({
                    description: description
                }, {
                    // wait for server response, before adding
                    // model to collection
                    wait: true,

                    // callback invoked when the backed refuse
                    // to save model
                    error: function() {
                        notices.notify('create', {
                            title: "Create failed",
                            text: "Server refuse to create task. Try another one."
                        })
                    }
                });
                this.input.val('');
            }
        }
    });

    window.TodoList = Backbone.Router.extend({
        routes: {
            '': "home"
        },

        initialize: function() {
            this.homeView = new HomeView();
        },

        home: function() {
            this.homeView.render();
        }
    });

    // Bootstrap the application
    window.App = new TodoList();
    Backbone.history.start({
        pushState: true
    });
    window.App.home();

    // Init jQuery notify plugin
    notices.notify({
        speed: 250,
        expires: 3000
    });

});