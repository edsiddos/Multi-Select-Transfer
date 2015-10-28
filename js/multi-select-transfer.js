

var MultiSelectTransfer = function (elem, data) {

    var template;
    var element = document.querySelector(elem);
    var data = {
        origin: (typeof data === "undefined" || typeof data.origin === "undefined" ? "" : data.origin),
        destiny: (typeof data === "undefined" || typeof data.destiny === "undefined" ? "" : data.destiny),
        name_select_origin: (typeof data === "undefined" || typeof data.name_select_origin === "undefined" ? "mst-origin" : data.name_select_origin),
        name_select_destiny: (typeof data === "undefined" || typeof data.name_select_destiny === "undefined" ? "mst-destiny" : data.name_select_destiny)
    };

    /**
     * Método que realiza a geração dos dois select's e dos botões.
     * Preenche os select com as options.
     * Adiciona os eventos aos botões de adicionar e remover.
     */
    this.init = function () {
        template = '<div id="multi-select-transfer">\
                        <div id="mst-filters">\
                            <div id="mst-filters-left">\
                                <input type="text" id="mst-filter-origin" />\
                            </div>\
                            <div id="mst-filters-right">\
                                <input type="text" id="mst-filter-destiny" />\
                            </div>\
                        </div>\
                        <div id="mst-selects">\
                            <div id="mst-left">\
                                <select multiple="multiple" name="' + data.name_select_origin + '[]" id="mst-origin"></select>\
                            </div>\
                            <div id="mst-right">\
                                <div id="mst-buttons">\
                                    <button type="button" id="mst-select-add"> > </button>\
                                    <button type="button" id="mst-select-rem"> < </button>\
                                    <button type="button" id="mst-select-add-all"> >> </button>\
                                    <button type="button" id="mst-select-rem-all"> << </button>\
                                </div>\
                                <div id="mst-select-destiny">\
                                    <select multiple="multiple" name="' + data.name_select_destiny + '[]" id="mst-destiny"></select>\
                                </div>\
                            </div>\
                        </div>\
                    </div>';

        /*
         * Exibe tabela conforme template acima.
         * Preenche os select's origin e destiny.
         */
        element.innerHTML = template;
        origin();
        destiny();

        /*
         * Adiciona evento de adicionar e remover
         * valores das caixa de seleção
         */
        // Ao dar duplo click em um option esta pode ser:
        doubleClickAddOption(); // Move option para select destiny
        doubleClickRemOption(); // Move option para select origin

        addOption();
        remOption();
        addAllOption();
        remAllOption();

        /*
         * Cria evento de filtro ao digitar nos input's
         */
        filter('#multi-select-transfer #mst-origin', '#multi-select-transfer #mst-filter-origin');
        filter('#multi-select-transfer #mst-destiny', '#multi-select-transfer #mst-filter-destiny');
    };

    /**
     * Adiciona opções ao select origin
     * @param {objeto} data_origin objeto com dados a ser inserido no select de origem
     */
    this.setOrigin = function (data_origin) {
        data.origin = data_origin;
        origin();
        doubleClickAddOption();
    };

    /**
     * Seleciona todas as options da select origin
     */
    this.originSelect = function () {
        var options = document.querySelector('#mst-origin').options;

        for (key in options) {
            options[key].selected = true;
        }
    };

    /**
     * Adiciona opções ao select destiny
     * @param {type} data_destiny objeto com dados a ser inserido no select de destino
     */
    this.setDestiny = function (data_destiny) {
        data.destiny = data_destiny;
        destiny();
        doubleClickRemOption();
    };

    /**
     * Seleciona todas as options da select destiny
     */
    this.destinySelect = function () {
        var options = document.querySelector('#mst-destiny').options;

        for (key in options) {
            options[key].selected = true;
        }
    };

    /**
     * Preenche select origin
     * caixa de seleção da esquerda
     */
    var origin = function () {
        if (typeof data.origin === 'object') {
            var options = '';

            for (key in data.origin) {
                options += '<option value="' + data.origin[key]['value'] + '">' + data.origin[key]['name'] + '</option>';
            }

            document.querySelector('#multi-select-transfer #mst-origin').innerHTML = options;
            sortSelect('mst-origin');
        }
    };

    /**
     * Preenche select destiny
     * caixa de seleção da direita
     */
    var destiny = function () {
        if (typeof data.destiny === 'object') {
            var options = '';

            for (key in data.destiny) {
                options += '<option value="' + data.destiny[key]['value'] + '">' + data.destiny[key]['name'] + '</option>';
            }

            document.querySelector('#multi-select-transfer #mst-destiny').innerHTML = options;
            sortSelect('mst-destiny');
        }
    };

    /**
     * Ordena as options
     * @param {string} id_select ID do select
     */
    var sortSelect = function (id_select) {
        var select = document.querySelector('#' + id_select)
        var array = new Array();

        for (var i = 0; i < select.options.length; i++) {
            array[i] = new Array();
            array[i][0] = select.options[i].text;
            array[i][1] = select.options[i].value;
        }

        array.sort();

        while (select.options.length > 0) {
            select.options.remove(-1);
        }

        for (var i = 0; i < array.length; i++) {
            var option = document.createElement('option');
            option.value = array[i][1];
            option.text = array[i][0];
            select.options.add(option, i);
        }
    };

    /**
     * Move options selecionadas
     * @param {string} id_origem ID da select de origim
     * @param {string} id_destino ID da select de destino
     */
    var transferOptions = function (id_origem, id_destino) {
        var origem = document.getElementById(id_origem);
        var destino = document.getElementById(id_destino);

        while (origem.selectedIndex >= 0) {

            var position = origem.selectedIndex;
            var option = origem.options[position];
            var new_option = document.createElement("option");
            new_option.value = option.value;
            new_option.text = option.text;
            new_option.selected = true;

            try {
                destino.add(new_option, null);
                origem.remove(position, null);
            } catch (error) {
                destino.add(new_option);
                origem.remove(position);
            }
        }

    };

    /**
     * Adiciona evente de mover option do select origin para destiny
     * quando der duplo clique na select destiny
     */
    var doubleClickAddOption = function () {
        var options = document.querySelectorAll('#mst-origin option');

        for (key in options) {
            options[key].addEventListener('dblclick', function () {
                options[key].selected = true;
                transferOptions('mst-origin', 'mst-destiny');
                sortSelect('mst-destiny');
            });
        }
    };

    /**
     * Adiciona evente de mover option do select origin para destiny
     * quando der duplo clique na select destiny
     */
    var doubleClickRemOption = function () {
        var options = document.querySelectorAll('#mst-origin option');

        for (key in options) {
            options[key].addEventListener('dblclick', function () {
                options[key].selected = true;
                transferOptions('mst-origin', 'mst-destiny');
                sortSelect('mst-destiny');
            });
        }
    };

    /**
     * Evento ao clicar remove options selecionadas de origin para destiny
     */
    var addOption = function () {
        document.querySelector('#multi-select-transfer #mst-select-add').onclick = function () {
            transferOptions('mst-origin', 'mst-destiny');
            sortSelect('mst-destiny');
        };
    };

    /**
     * Evento ao clicar remove options selecionadas em destiny para origin
     */
    var remOption = function () {
        document.querySelector('#multi-select-transfer #mst-select-rem').onclick = function () {
            transferOptions('mst-destiny', 'mst-origin');
            sortSelect('mst-origin');
        };
    };

    /**
     * Evento ao clicar remove todas options origin para destiny
     */
    var addAllOption = function () {
        document.querySelector('#multi-select-transfer #mst-select-add-all').onclick = function () {
            var options = document.querySelector('#mst-origin').options;

            for (key in options) {
                options[key].selected = true;
            }

            transferOptions('mst-origin', 'mst-destiny');
            sortSelect('mst-destiny');
        };
    };

    /**
     * Remove todas as options de destiny e adiciona em origin
     */
    var remAllOption = function () {
        document.querySelector('#multi-select-transfer #mst-select-rem-all').onclick = function () {
            var options = document.querySelector('#mst-destiny').options;

            for (key in options) {
                options[key].selected = true;
            }

            transferOptions('mst-destiny', 'mst-origin');
            sortSelect('mst-origin');
        };
    };

    /**
     * Realiza filtragem das inputs.
     * @param string select Seletor da caixa de seleção (select)
     * @param string input Seletor do input
     */
    var filter = function (select, input) {
        document.querySelector(input).onkeyup = function () {
            var search = this.value;

            var obj_search = new RegExp(search, 'i');
            var options = document.querySelector(select).options;

            for (key in options) {
                if (obj_search.test(options[key]['text'])) {
                    options[key]['style']['display'] = '';
                } else {
                    options[key]['style']['display'] = 'none';
                }
            }

        };
    };

};