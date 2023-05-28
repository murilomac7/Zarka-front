var jsonFinal = [];
var conectoresAtivos = [];
var operatorI = 0;

var dataFlowchart = {
  operators: {},
};

var $flowchart = $(".grid-mask");

$(function () {
  $flowchart.flowchart({
    data: dataFlowchart,
  });

  criarEventosDeDraggable();
  $("#droppable").droppable({
    accept: ".card-integration",
    drop: function (event, ui) {
      var element = ui.helper[0];

      var top = ui.helper.position().top;
      var left = ui.helper.position().left;

      var ultimoNode = $("#ultimoNode").val();
      var hasInput = true;

      if (ultimoNode == "") {
        hasInput = false;
      }

      var parametros = "";

      $.ajax({
        type: "GET",
        url: `https://zarka.herokuapp.com/sdk/connector/schema/${element.dataset.connectorname}/${element.dataset.method}`,
        headers: { Authorization: sessionStorage.getItem("token") },
        success: function (result) {
          if (result.errorMessage == "null") {
            var requestObj = Object.keys(JSON.parse(result.schemaRequest));
            parametros = document.createElement("form");
            parametros.classList.add("form-connector");
            parametros.setAttribute(
              "id",
              "form_" + element.dataset.connectorname
            );

            requestObj.forEach(function (param) {
              createDynamicElement(element, parametros, param);
            });

            if (element.classList.contains("drag-card")) {
              addCardFlowchart(
                top,
                left,
                element.dataset.name,
                element.dataset.icon,
                hasInput,
                parametros
              );
              $("#ultimoNode").val(element.dataset.id);
              conectoresAtivos.push({
                conector: element.dataset.connectorname,
                method: element.dataset.method,
                params: requestObj,
              });
            }
          }
        },
        error: function (err) {
          alert(err);
        },
      });
    },
  });
});

$("#btn-send-flow").on("click", function () {
  conectoresAtivos.forEach(function (conector) {
    var body = {};

    conector.params.forEach(function (param) {
      body[param] = $(`#${conector.conector}_${param}`).val();
    });

    var requestFinal = {
      connectorName: conector.conector,
      requestBody: body,
      requestName: conector.method,
      activity: "retrieve",
    };

    jsonFinal.push(requestFinal);
  });

  var bodyRequest = JSON.stringify(jsonFinal);

  $.ajax({
    method: "POST",
    url: "https://zarka.herokuapp.com/sdk/workflow/run",
    headers: { Authorization: sessionStorage.getItem("token") },
    data: bodyRequest,
    contentType: "application/json",
    success: function (response) {
      console.log(response);
    },
    error: function (response) {
      alert("Erro: " + response.responseText);
    },
  });
});

function criarEventosDeDraggable() {
  $("#draggable").draggable();
  $(".drag-card").draggable({
    helper: "clone",
  });
  $(".clone").draggable();
}

function addCardFlowchart(topPos, leftPos, title, icon, hasInput, parametros) {
  var operatorId = "created_operator_" + operatorI;
  var operatorData = {
    top: topPos,
    left: leftPos,
    properties: {
      title:
        `<img class='connector-logo small me-1' src="img/connector-logos/${icon}" />` +
        title,
      body: parametros,
      inputs: {},
      outputs: {
        output_1: {
          label: "saída",
        },
      },
      class: "custom-operator",
    },
  };

  if (hasInput) {
    var inputToAdd = {
      input_1: {
        label: "entrada",
      },
    };

    Object.assign(operatorData.properties.inputs, inputToAdd);
  }

  operatorI++;

  $flowchart.flowchart("createOperator", operatorId, operatorData);

  $flowchart.flowchart({
    onLinkCreate: function (linkId, linkData) {
      $("#ChatGPT_text").val('$imageContent');
      $("#ChatGPT_text").attr("disabled", true);
      return true;
    },
  });
}

function showAdvancedParams(index) {
  var card = $("#created_operator_" + index);
}

function createDynamicElement(element, parametros, param) {
  var label = document.createElement("label");
  label.innerHTML = param;
  parametros.appendChild(label);

  var input;

  if (param == "type") {
    input = document.createElement("select");
    var option1 = document.createElement("option");
    option1.value = "topic";
    option1.text = "Tópico";

    var option2 = document.createElement("option");
    option2.value = "study";
    option2.text = "Estudo";

    input.appendChild(option1);
    input.appendChild(option2);
  } else {
    input = document.createElement("input");
  }

  input.setAttribute("id", `${element.dataset.connectorname}_${param}`);
  parametros.appendChild(input);
}
