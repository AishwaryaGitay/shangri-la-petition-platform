package exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.shangrila.slpp.dto.ErrorResponseDTO;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PetitionNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handlePetitionNotFoundException(PetitionNotFoundException ex) {
        return new ResponseEntity<>(new ErrorResponseDTO(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PetitionClosedException.class)
    public ResponseEntity<ErrorResponseDTO> handlePetitionClosedException(PetitionClosedException ex) {
        return new ResponseEntity<>(new ErrorResponseDTO(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SignatureThresholdReachedException.class)
    public ResponseEntity<ErrorResponseDTO> handleSignatureThresholdReachedException(SignatureThresholdReachedException ex) {
        return new ResponseEntity<>(new ErrorResponseDTO(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadySignedException.class)
    public ResponseEntity<ErrorResponseDTO> handleAlreadySignedException(AlreadySignedException ex) {
        return new ResponseEntity<>(new ErrorResponseDTO(ex.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(SelfSignException.class)
    public ResponseEntity<ErrorResponseDTO> handleSelfSignException(SelfSignException ex) {
        return new ResponseEntity<>(new ErrorResponseDTO(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleException(Exception ex) {
        return new ResponseEntity<>(new ErrorResponseDTO("An unexpected error occurred: " + ex.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}