(function($) {

    window.Task = Backbone.Model.extend({
        description: function() {
            return this.get('description');
        }
    });

    window.Tasks = Backbone.Collection.extend({
        model: Task,
        url: "/tasks",

        initialize: function() {
            this.fetch();
        }
    });

    window.tasks = new Tasks();

    window.TasksView = Backbone.View.extend({
        tagName: 'section',

        initialize: function() {
            // Bind render method to this object
            _.bindAll(this, 'render');

            // Get the template that will be rendered
            this.template = _.template($('#tasks-template').html());

            // Bind invocation of render if the 'reset' event
            // on tasks collection is raised
            this.collection.on('reset', this.render, this);
        },

        render: function() {
            $(this.el).html(this.template({
                tasks: this.collection.toJSON()
            }));
            return this;
        }
    });

    window.TodoList = Backbone.Router.extend({
        routes: {
            '': "home"
        },

        initialize: function() {
            this.tasksView = new TasksView({
                collection: window.tasks
            });
        },

        home: function() {
            $("#container").empty();
            $("#container").append(this.tasksView.render().el);
        }
    });

    $(document).ready(function() {
        window.App = new TodoList();
        Backbone.history.start({
            pushState: false
        });
        window.App.home();
    });

})(jQuery);