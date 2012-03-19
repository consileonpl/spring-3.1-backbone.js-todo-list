package pl.consileon.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import pl.consileon.model.Task;
import pl.consileon.repository.TasksRepository;
import pl.consileon.web.api.Notification;

import javax.validation.Valid;
import java.util.List;

import static java.lang.String.format;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.*;

@Controller
@RequestMapping(value = "/api/v1/tasks", produces = "application/json")
@Transactional
public class TasksController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TasksController.class);

    @Autowired
    private TasksRepository tasksRepository;

    @RequestMapping(method = GET)
    @ResponseBody
    public List<Task> list() {
        LOGGER.info("Fetching all tasks");
        return tasksRepository.findAll();
    }

    @RequestMapping(method = POST, consumes = "application/json")
    @ResponseStatus(CREATED)
    @ResponseBody
    public Task create(@Valid @RequestBody Task task) {
        LOGGER.info("Create new task: '{}'", task);
        if (tasksRepository.findByDescription(task.getDescription()) != null) {
            LOGGER.info("Cannot create task. Another task with given description already exists.");
            throw new DescriptionUniquenessViolationException(task.getDescription());
        }
        return tasksRepository.save(task);
    }

    @RequestMapping(value = "{id}", method = PUT, consumes = "application/json")
    @ResponseStatus(OK)
    @ResponseBody
    public Task update(@Valid @RequestBody Task task, @PathVariable Long id) {
        LOGGER.info("Update task: '{}'", task);
        // check if there is another task with same description
        Task other = tasksRepository.findByDescription(task.getDescription());
        if (other != null && !other.getId().equals(id)) {
            LOGGER.info("Cannot update task. Another task with given description already exists.");
            throw new DescriptionUniquenessViolationException(task.getDescription());
        }
        return tasksRepository.save(task);
    }

    @RequestMapping(value = "{id}", method = DELETE)
    @ResponseStatus(OK)
    public void destroy(@PathVariable Long id) {
        LOGGER.info("Remove task: '{}'", id);
        tasksRepository.delete(id);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public Notification onMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        FieldError error = ex.getBindingResult().getFieldError();
        return new Notification(error.getField() + " " + error.getDefaultMessage());
    }

    @ExceptionHandler(DescriptionUniquenessViolationException.class)
    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    public Notification onMethodArgumentNotValidException(DescriptionUniquenessViolationException ex) {
        return new Notification(format("Tasks with description '%s' already exists", ex.getDescription()));
    }
}
