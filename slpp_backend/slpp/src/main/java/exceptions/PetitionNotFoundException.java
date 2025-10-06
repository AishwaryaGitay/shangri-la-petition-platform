package exceptions;

@SuppressWarnings("serial")
public class PetitionNotFoundException extends RuntimeException {
    public PetitionNotFoundException(String message) {
        super(message);
    }
}