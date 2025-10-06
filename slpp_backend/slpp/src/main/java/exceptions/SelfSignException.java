package exceptions;

@SuppressWarnings("serial")
public class SelfSignException extends RuntimeException {
    public SelfSignException(String message) {
        super(message);
    }
}