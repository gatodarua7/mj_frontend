<template>
  <canvas
    :id="name"
  />
</template>

<script>
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes'
import Chart from 'chart.js'

export default {
  props: {
    name: String,
    data: Object,
    type: String
  },
  mounted() {
    var ctx = document.getElementById(this.name)
    new Chart(ctx, {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: false,
        stacked: false,
        plugins: {
          colorschemes: {
            scheme: ['#f07f09', '#9f2936', '#1b587c', '#4e8542', '#604878', '#c19859'],
          }
        },
        tooltips: {
          enabled: false,
          custom: function(tooltipModel) {
            var tooltipEl = document.getElementById('chartjs-tooltip')
            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip'
              tooltipEl.innerHTML = '<table></table>'
              tooltipEl.style.backgroundColor = '#FFFFFF'
              tooltipEl.style.borderColor = '#000000'
              tooltipEl.style.borderWidth = 'thin'
              tooltipEl.style.borderStyle = 'solid'
              document.body.appendChild(tooltipEl)
            }
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0
              return
            }
            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }
            function getBody(bodyItem) {
              return bodyItem.lines
            }
            if (tooltipModel.body) {
              var titleLines = tooltipModel.title || []
              var bodyLines = tooltipModel.body.map(getBody)
              var innerHtml = '<thead>'
              titleLines.forEach(function(title) {
                innerHtml += '<tr><th>' + title + '</th></tr>'
              })
              innerHtml += '</thead><tbody>'
              bodyLines.forEach(function(body, i) {
                var colors = tooltipModel.labelColors[i]
                var style = 'background:' + colors.backgroundColor
                style += '; border-color:' + colors.borderColor
                style += '; border-width: 2px'
                var span = '<span style="' + style + '"></span>'
                innerHtml += '<tr><td>' + span + body + '</td></tr>'
              })
              innerHtml += '</tbody>'
              var tableRoot = tooltipEl.querySelector('table')
              tableRoot.innerHTML = innerHtml
            }
            var position = this._chart.canvas.getBoundingClientRect()
            tooltipEl.style.opacity = 1
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px'
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px'
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
            tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
            tooltipEl.style.pointerEvents = 'none'
          }
        }
      }
    })
  }
}
</script>