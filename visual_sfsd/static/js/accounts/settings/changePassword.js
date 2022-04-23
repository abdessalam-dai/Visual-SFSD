const changePasswordForm = $('#change-password-form');
changePasswordForm.submit(function (e) {
    e.preventDefault();
    $.ajax({
        type: changePasswordForm.attr('method'),
        url: changePasswordForm.attr('action'),
        data: changePasswordForm.serialize(),
        success: function (response) {
            $("#form-response").html('<strong><p class="text-info">' + response + '</p></strong>');
        },
        error: function () {
            $("#form-response").html('<strong><p class="text-danger">Error!</p></strong>');
        }
    });
    return false;
});