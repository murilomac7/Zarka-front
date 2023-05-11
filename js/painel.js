var parametros = [
    '<form><label>Titulo</label><input type="text" class="form-control" /><label>Email</label><br><input type="text" class="form-control" /><label>Diretório</label><br><input type="text" class="form-control" /></form>',
    '<form><label>Pasta</label><input type="text" class="form-control" /></form>',
    '<form><label>Titulo</label><input type="text" class="form-control" /><label>Container</label><br><input type="text" class="form-control" /></form>',
    '<form><label>Repositório</label><input type="text" class="form-control" /><label>Usuário</label><br><input type="text" class="form-control" /></form>',
    '<form><label>Repositório</label><input type="text" class="form-control" /><label>Usuário</label><br><input type="text" class="form-control" /></form>',
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
            title: `<i class="fa-brands ${icon} me-1"></i>` + title,
            body: parametros,
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