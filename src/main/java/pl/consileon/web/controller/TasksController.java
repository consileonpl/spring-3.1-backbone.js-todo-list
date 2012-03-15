package pl.consileon.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import pl.consileon.model.Task;
import pl.consileon.repository.TasksRepository;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@Controller
@RequestMapping(value = "/tasks", produces = "application/json")
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

    @RequestMapping(method = POST, consumes = "application/x-www-form-urlencoded")
    @ResponseBody
    public Task create(String description) {
        LOGGER.info("Create new task with description: '{}'", description);
        return tasksRepository.save(new Task(description));
    }
}
