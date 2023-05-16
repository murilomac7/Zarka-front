var parametros = [
    '<form><label>Diretório</label><input type="text" class="form-control" /><div class="advanced-params hidden"><label>Título</label><input type="text" class="form-control" /></div></form>',
    '<form><label>Tipo</label><select class="form-select"><option>Selecione...</option><option value="1">Resumo</option></select><label>Prompt</label><input type="text" class="form-control" /></form>',
    '<form><label>Titulo</label><input type="text" class="form-control" /></form>',
];
var operatorI = 0;

var dataFlowchart = {
    operators: {}
};

var $flowchart = $('.grid-mask');

$(function () {

    $flowchart.flowchart({
        data: dataFlowchart
    });

    criarEventosDeDraggable();
    $("#droppable").droppable({
        accept: ".card-integration",
        drop: function (event, ui) {
            var element = ui.helper[0];

            var top = ui.helper.position().top;
            var left = ui.helper.position().left;

            var ultimoNode = $('#ultimoNode').val();
            var hasInput = true;

            if (ultimoNode == '') {
                hasInput = false;
            }

            if (element.classList.contains('drag-card')) {
                addCardFlowchart(top, left, element.dataset.name, element.dataset.icon, hasInput, parametros[element.dataset.id - 1]);
                $('#ultimoNode').val(element.dataset.id);
            }

        }
    });
});

function criarEventosDeDraggable() {

    $("#draggable").draggable();
    $(".drag-card").draggable({
        helper: "clone"
    });
    $(".clone").draggable();
}

function addCardFlowchart(topPos, leftPos, title, icon, hasInput, parametros) {
    var operatorId = 'created_operator_' + operatorI;
    var operatorData = {
        top: topPos,
        left: leftPos,
        properties: {
            title: `<img class='connector-logo small me-1' src="img/connector-logos/${icon}" />` + title,
            body: parametros + `<div class='btn-show-params'>Parâmetros avançados <button type='button' class='btn btn-dark' onclick='showAdvancedParams(${operatorI})'><i class='fa fa-chevron-down'></i></button></div>`,
            inputs: {},
            outputs: {
                output_1: {
                    label: 'saída',
                }
            },
            class: 'custom-operator'
        }
    };

    if(hasInput){
        var inputToAdd = {
            input_1: {
                label: 'entrada',
            }
        };

        Object.assign(operatorData.properties.inputs, inputToAdd);
    }

    operatorI++;

    $flowchart.flowchart('createOperator', operatorId, operatorData);
}

function showAdvancedParams(index){
    console.log(index)
    var card = $('#created_operator_' + index);

    console.log(card.children())
}