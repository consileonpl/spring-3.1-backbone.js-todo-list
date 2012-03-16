package pl.consileon.web.api;

public class Notification {
    private String content;

    public Notification(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }
}
