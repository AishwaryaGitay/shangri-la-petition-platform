package exceptions;

@SuppressWarnings("serial")
public class AlreadySignedException extends RuntimeException {
    public AlreadySignedException(String message) {
        super(message);
    }
}