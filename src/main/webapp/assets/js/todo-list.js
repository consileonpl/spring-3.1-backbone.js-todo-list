$(function() {

    window.notices = $("#notices");

    // Represents single task
    window.Task = Backbone.Model.extend({
        url: "/api/v1/tasks",

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
        toggleDone: function() {
            this.save({
                done: !this.get('done')
            });
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
            "click .remove-task": "removeTask",
            "click .edit-task": "editTask",
            "dblclick .show": "editTask"
        },

        initialize: function() {
            // Bind render method to this object
            _.bindAll(this,
                'render',
                'slideAndRemove',
                'updateState',
                'toggleDone',
                'removeTask',
                'editTask',
                'updateTask',
                'notifyUpdateFailed',
                'closeEditing'
            );

            // Bind to template
            this.template = _.template($("#task-template").html());

            // Bind to model events
            this.model.on('change', this.render, this);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            this.updateState();
            return this;
        },

        slideAndRemove: function() {
            this.$el.slideUp(250, function() {
                $(this).remove();
            });
        },

        updateState: function() {
            this.$el.toggleClass("done", this.model.done());

            // Bind edit input
            this.editInput = this.$("input");
            this.editInput.val(this.model.description());
        },

        toggleDone: function() {
            this.model.toggleDone();
        },

        removeTask: function() {
            this.model.destroy({
                success: this.slideAndRemove
            });
        },

        editTask: function() {
            this.currentVal = this.model.description();
            this.$el.addClass("editing");
            this.editInput.bind('blur', this.updateTask);
            this.editInput.focus();
        },

        updateTask: function() {
            var newVal = this.editInput.val();
            if (this.currentVal != newVal) {
                this.model.save({
                    description: newVal
                }, {
                    wait: true,
                    success: this.closeEditing,
                    error: this.notifyUpdateFailed
                });
            } else {
                this.closeEditing();
            }
        },

        notifyUpdateFailed: function(model, resp) {
            // Parse error message from response content
            var msg = JSON.parse(resp.responseText).content;

            // Create notification
            notices.notify('create', {
                title: "Create failed",
                text: msg
            });

            this.editInput.focus();
        },

        closeEditing: function() {
            this.$el.removeClass("editing");
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
            "keypress #create-task": "createTaskOnEnter"
        },

        initialize: function() {
            // Bind render method to this object
            _.bindAll(this,
                'render',
                'createTask',
                'createTaskOnEnter',
                'renderTask',
                'updateOrder'
            );

            // Wrap view elements
            this.inputEl = $("#create-task");
            this.tasksEl = $("ul");

            // Bind invocation of render if the 'reset' event
            // on tasks collection is raised
            this.collection.on('add', this.renderTask, this);
            this.collection.on('reset', this.render, this);

            // Fetch data from the backend
            this.collection.fetch();
        },

        render: function() {
            this.collection.each(this.renderTask);
            this.tasksEl.sortable({
                update: this.updateOrder
            });
            this.inputEl.tipsy({
                fade: true,
                trigger: 'focus',
                gravity: 'w'
            });
            return this;
        },

        updateOrder: function(e, ui) {
            console.log("update order");
        },

        renderTask: function(task) {
            var view = new TaskView({
                model: task
            });
            this.tasksEl.append(view.render().el);
        },

        createTask: function() {
            var description = this.inputEl.val();
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
                    });
                }
            });
            this.inputEl.val('');
        },

        createTaskOnEnter: function(e) {
            // Process only on return pressed
            if (e.keyCode == 13) {
                this.createTask();
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
            this.homeView = new HomeView({
                collection: window.tasks
            });
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
