function validateForm() {
    const nameInput = document.getElementById("name");
    const commentsInput = document.getElementById("comments");
    const isGenderSelected = document.querySelector('input[name="gender"]:checked');

    if (!IsInputValid(nameInput)) {
        alert("Please enter your name.");
        nameInput.focus();
        return false;
    }

    if (!IsInputValid(commentsInput)) {
        alert("Please enter your comments.");
        commentsInput.focus();
        return false;
    }

    if (!isGenderSelected) {
        alert("Please select your gender.");
        document.querySelector('input[name="gender"]').focus();
        return false;
    }

    alert("Form submitted successfully!");
    return true;
}

function IsInputValid(input) {
    if (input.value.trim() === "") {
        return false;
    }
}
