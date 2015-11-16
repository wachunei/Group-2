document.addEventListener('DOMContentLoaded', mainfn);

function mainfn() {
  var proto = Object.create(HTMLElement.prototype, {
    value: {
      get: function() {
        var gen = this.shadowRoot.querySelector('#gen .selected').getAttribute('data-value') || '';
        var number = this.shadowRoot.querySelector('#number').value || '';
        var final = this.shadowRoot.querySelector('#final .selected').getAttribute('data-value') || '';
        return gen+number+final;
      },
      set: function(newValue) {
        if(newValue.length != 8 && newValue.length != 7) {
          return;
        }

        var value = String(newValue);
        var final = value[value.length-1];
        var number = value.substr(value.length-6,  value.length - (value.length == 8? 3:2));
        var gen = value.substr(0, value.length-6);

        this.shadowRoot.querySelector('#final .selected').setAttribute('data-value', final);
        this.shadowRoot.querySelector('#final .selected').textContent = final;

        this.shadowRoot.querySelector('#number').value = number;

        this.shadowRoot.querySelector('#gen .selected').setAttribute('data-value', gen);
        this.shadowRoot.querySelector('#gen .selected').textContent = gen;
      }
    },
    createdCallback: {
      value: function() {
        var template = document.querySelector('#num-alumno-puc-template');
        var clone = document.importNode(template.content, true);
        this.createShadowRoot().appendChild(clone);
        var liElements = this.shadowRoot.querySelectorAll('.selector ul li');

        [].forEach.call(liElements, function(liElement) {
            liElement.addEventListener('click', clickOnLi);
        });

        function clickOnLi(event) {
          var selected = event.target.parentNode.querySelector('.selected');
          var textContent = event.target.textContent;
          var value = event.target.getAttribute('data-value');
          selected.textContent = textContent;
          selected.setAttribute('data-value', value);
          if (event.target.parentNode.nextElementSibling &&
            event.target.parentNode.nextElementSibling.tagName == 'input'){ event.target.parentNode.nextElementSibling.focus();}
        }

      }
    }
  });
  var NumAlumno = document.registerElement('numalumno-puc', {prototype: proto});
}
