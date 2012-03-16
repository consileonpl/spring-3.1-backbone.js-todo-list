$(function() {

    window.notices = $("#notices");

    // Represents single task
    window.Task = Backbone.Model.extend({
        defaults: {
            done: false
        },

        // Return task's description
        description: function() {
            return this.get('description');
        },

        // Return task's done flag
        done: function() {
            return this.get('done');
        },

        // Toggle task's 'done' flag. Operation
        // is saved to the backend server.
        toggle: function(options) {
            this.save({
                done: !this.get('done')
            }, {
                // Wait for server response
                wait: true
            }, options)
        }
    });

    // Represents collection of tasks
    window.Tasks = Backbone.Collection.extend({
        model: Task,
        url: "/api/v1/tasks"
    });

    window.tasks = new Tasks();

    // View responsible for rendering single task
    // on list
    window.TaskView = Backbone.View.extend({
        tagName: 'li',
        className: 'task',

        events: {
            "click .done-task": "toggleDone",
            "click .remove-task": "removeTask"
        },

        initialize: function() {
            // Bind render method to this object
            _.bindAll(this,
                'render',
                'remove',
                'updateState',
                'toggleDone',
                'removeTask');

            // Bind to template
            this.template = _.template($("#task-template").html());

            // Bind to model events
            this.model.on('change', this.render, this);
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            this.updateState();
            return this;
        },

        remove: function() {
            $(this.el).remove();
        },

        updateState: function() {
            $(this.el).toggleClass("done", this.model.done());
        },

        toggleDone: function() {
            this.model.toggle({
                success: this.updateState
            });
        },

        removeTask: function() {
            this.model.destroy({
                success: this.remove
            });
        }
    });

    // View responsible for rendering tasks list
    window.TasksView = Backbone.View.extend({
        tagName: 'ul',
        id: 'tasks',

        initialize: function() {
            // Bind render method to this object
            _.bindAll(this, 'render');

            // Bind invocation of render if the 'reset' event
            // on tasks collection is raised
            this.collection.on('add', this.renderTask, this);
            this.collection.on('reset', this.render, this);

            // Fetch data from the backend
            this.collection.fetch();
        },

        render: function() {
            this.collection.each(this.renderTask);
            return this;
        },

        renderTask: function(task) {
            var view = new TaskView({
                model: task
            });
            this.$("ul").append(view.render().el);
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
                    error: function(model, resp) {
                        // Parse error message from response content
                        var msg = JSON.parse(resp.responseText).content;

                        // Create notification
                        notices.notify('create', {
                            title: "Create failed",
                            text: msg
                        })
                    }
                });
                this.input.val('');
            }
        }
    });

    // Application router. Technically it is not required for
    // this app, while it consist of only one page. However it
    // is added to show how Backbone.js deals with routing.
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