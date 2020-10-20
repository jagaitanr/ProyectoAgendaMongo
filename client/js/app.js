class EventManager {
    constructor() {
        this.urlBase = "http://localhost:8082/app"
        //this.urlBase = "http://localhost:8082"
        this.datosUsuario()
        this.obtenerDataInicial()
        this.inicializarFormulario()
        this.guardarEvento()
        this.verificarLogin()
    }

verificarLogin(){
  let url = this.urlBase + "/login";
  var var1 = "OK"
  console.log("entro a verificar login");
  return var1;
}

    datosUsuario(){
      let url = this.urlBase + "/user";
      var user = {usuario: localStorage.getItem("user")};
      var sec = "";
      $.post(url,user, (response) => {
       sec =  response._id;
      })
      return sec;
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all"
        var user = {usuario: localStorage.getItem("user")};
        $.post(url,user, (response) => {
            this.inicializarCalendario(response)
        })
    }

    eliminarEvento(evento) {
        let url = this.urlBase + "/delete"
        var user = {id: evento.id};
        $.post(url,user,(response) => {
            alert(response)
        })
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault()
            let nombre = $('#titulo').val(),
            start = $('#start_date').val(),
            title = $('#titulo').val(),
            end = $('#start_date').val(),
            start_hour = '',
            end_hour = '';

            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val()
                start_hour = $('#start_hour').val()
                end_hour = $('#end_hour').val()
                start = start + 'T' + start_hour
                end = end + 'T' + end_hour
            }
            let url = this.urlBase + "/new"

            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end,
                    userId: localStorage.getItem("user")
                };
                $.post(url, ev, (response) => {
                    alert(response)
                })
                $('.calendario').fullCalendar('renderEvent', ev)
            } else {
                alert("Complete los campos obligatorios para el evento")
            }
        })
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function(){
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled")
            }else {
                $('.timepicker, #end_date').removeAttr("disabled")
            }
        })
    }

    actualizarEvento(evento) {
        let id = evento.id;

        var start_hour = evento.start._d.toString().substr(11,8);
        var end_hour = evento.end._d.toString().substr(11,8);

        let url = this.urlBase + "/update"
        let ev = {
            id: id,
            start: evento.start._d,
            end: evento.end._d,
            startHour: start_hour,
            endHour: end_hour
        };
        $.post(url, ev, (response) => {
            alert(response)
        })


    }

    inicializarCalendario(eventos){
      var listEvents = [];
      // noinspection JSAnnotator
      if(eventos != 'undefined'){
        eventos.forEach(item => {
          var evento = {
                    id: item._id,
                    title  : item.title,
                    start  : item.startDate,
                    end    : item.endDate
                    };
            listEvents.push(evento);
          })
        }
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: new Date(),
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event)
            },

            events: listEvents,
            eventDragStart: (event,jsEvent) => {
                $('.delete').find('img').attr('src', "img/trash-open.png");
                $('.delete').css('background-color', '#a70f19')
            },
            eventDragStop: (event,jsEvent) => {
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                        this.eliminarEvento(event)
                        $('.calendario').fullCalendar('removeEvents', event.id);
                    }
                }
            })
        }
    }

    const Manager = new EventManager()
