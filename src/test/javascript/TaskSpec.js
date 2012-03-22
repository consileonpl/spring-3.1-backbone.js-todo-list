describe("Task", function() {
    beforeEach(function() {
        this.task = new Task({
            id: 1,
            description: "Task A"
        });
    });

    it ("once created is assigned default values", function() {
        expect(this.task.done()).toBeFalsy();
    });

    it ("once created is assigned values given during construction", function() {
        expect(this.task.description()).toEqual("Task A");
    });

    it ("toggles its done state", function() {
        this.task.toggleDone();
        expect(this.task.done()).toBeTruthy();
        this.task.toggleDone();
        expect(this.task.done()).toBeFalsy();
    });
});