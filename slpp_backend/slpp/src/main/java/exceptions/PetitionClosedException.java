package exceptions;

@SuppressWarnings("serial")
public class PetitionClosedException extends RuntimeException {
    public PetitionClosedException(String message) {
        super(message);
    }
}
