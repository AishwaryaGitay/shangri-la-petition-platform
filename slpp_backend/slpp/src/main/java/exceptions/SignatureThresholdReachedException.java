package exceptions;

@SuppressWarnings("serial")
public class SignatureThresholdReachedException extends RuntimeException {
    public SignatureThresholdReachedException(String message) {
        super(message);
    }
}