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
    @ResponseBody
    public Task create(@Valid @RequestBody Task task) {
        LOGGER.info("Create new task: '{}'", task);
        if (tasksRepository.findByDescription(task.getDescription()) != null) {
            LOGGER.info("Cannot create task. Another task with given description already exists.");
            throw new DescriptionUniquenessViolationException(task.getDescription());
        }
        return tasksRepository.save(task);
    }

    @RequestMapping(method = PUT, consumes = "application/json")
    @ResponseBody
    public Task update(@Valid @RequestBody Task task) {
        LOGGER.info("Update task: '{}'", task);
        return tasksRepository.save(task);
    }

    @RequestMapping(method = DELETE, consumes = "application/json")
    public void destroy(@Valid @RequestBody Task task) {
        LOGGER.info("Update task: '{}'", task);
        tasksRepository.delete(task);
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
