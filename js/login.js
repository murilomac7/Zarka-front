$("#login-btn").on("click", function () {
  var body = JSON.stringify({ userId: "645eccab259f7cab95389e1f" });

  $.ajax({
    url: "https://zarka.herokuapp.com/sdk/workflow/token",
    type: "POST",
    data: body,
    contentType: "application/json",
    success: function (response) {
      console.log(response);
      sessionStorage.setItem("token", response);
      loginUser($('#user').val(), $('#password').val())
        .then(function (data) {
          location.href = "/painel";
        })
        .catch(function (err) {
          alert(err);
        });
    },
    error: function (err) {
      alert(err.responseText);
    },
  });
});

function loginUser(user, pass) {
  var body = JSON.stringify({ username: user, password: pass });
  return new Promise(function (resolve, reject) {
    $.ajax({
      method: "POST",
      url: "https://zarka.herokuapp.com/sdk/user/login",
      headers: { Authorization: sessionStorage.getItem("token") },
      data: body,
      contentType: "application/json",
      success: function (response) {
        resolve(response);
      },
      error: function (response) {
        reject("Erro: " + response.responseText);
      },
    });
  });
}
