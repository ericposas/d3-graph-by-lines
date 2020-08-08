import * as d3 from 'd3'
import './style.scss'
import random from 'random'
import {
	TweenLite,
	Power1,
	Bounce
} from 'gsap'


window.start = () => {

	let w = 700, h = 500, b = 40
	let max = 1000

	let svg = d3.select('svg')

	let _svg = document.getElementsByTagName('svg')[0]
	let _lines = document.getElementById('lines')
	_svg.setAttribute('width', w)
	_svg.setAttribute('height', h)
	_svg.style.border = '1px solid #000'

	const createData = (n, min, max) => (
		new Array(n).fill(1)
		.map(a => (
			[random.int(min, max), random.int(min, max)]
		))
	)

	let data = createData(20, 1, max)
	.sort((a, b) => a[0] - b[0]) // sort by x coord
	console.log(data)

	let scX = d3.scaleLinear()
	.domain(d3.extent(data, d => d[0])).nice()
	.range([b, w - b])

	let scY = d3.scaleLinear()
	.domain(d3.extent(data, d => d[1])).nice()
	.range([h - b, b])

	data.forEach(d => {
		let line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
		_lines.appendChild(line);
	})

	// prepare data
	let pairs = d3.pairs(data, (a, b) => ({ start: a, end: b }))
	console.log(data)

	let lines = svg.select('#lines')
	.selectAll('line')
	.data(pairs)
	.attr('x1', d => scX(d.start[0]))
	.attr('y1', d => h - scY(d.start[1]))
	.attr('x2', d => scX(d.end[0]) - 10)
	.attr('y2', d => h - (scY(d.end[1]) + scY(d.start[1]))/2)
	.transition().delay((d, i) => i * 150)
	.attr('x2', d => scX(d.end[0]))
	.attr('y2', d => h - scY(d.end[1]))
	.attr('stroke', '#000')

	let rects = svg.append('g').attr('id', 'rects')
	.selectAll('rect')
	.data(data).enter()
	.append('rect')
	.attr('x', d => scX(d[0]))
	.attr('y', d => h - scY(d[1]) - 17)
	.attr('fill', 'rgba(255, 255, 255, 0.5)')
	.attr('stroke', 'lightgrey')
	.attr('height', 12)
	.attr('opacity', 0)

	let texts = svg.append('g').attr('id', 'texts')
	.selectAll('text')
	.data(data).enter()
	.append('text')
	.text(d => `x:${Math.round(d[0])}, y:${Math.round(max - d[1])}`)
	.attr('x', d => scX(d[0]) + 4)
	.attr('y', d => h - scY(d[1]) - 8)
	.classed('label', true)
	.attr('opacity', 0)

	let dots = svg.append('g').attr('id', 'dots')
	.selectAll('circle')
	.data(data).enter()
	.append('circle')
	.on('click', d => { alert(`${Math.round(d[0])}, ${Math.round(max - d[1])}`) })
	.on('mouseover', (d, i, ds) => {
		TweenLite.to(ds[i], .5, { r: 7, ease: Power1.easeOut })
		d3.select('#texts').selectAll('text')._groups[0][i].setAttribute('opacity', 1)
		d3.select('#rects').selectAll('rect')._groups[0][i].setAttribute('opacity', 1)
	})
	.on('mouseout', (d, i, ds) => {
		TweenLite.to(ds[i], .35, { r: 3, ease: Power1.easeIn })
		d3.select('#texts').selectAll('text')._groups[0][i].setAttribute('opacity', 0)
		d3.select('#rects').selectAll('rect')._groups[0][i].setAttribute('opacity', 0)
	})
	.attr('cx', d => scX(d[0]))
	.attr('cy', d => h - scY(d[1]))
	.attr('fill', 'lightblue')
	.attr('stroke', 'blue')
	.attr('r', 0)
	.transition().duration(200).delay((d, i) => i * 100)
	.attr('r', 3)

	// to properly set width of the labels, we need to access
	//the previously created text bounding box with .getBBox()
	d3.select('#rects').selectAll('rect')
	.attr('width', (d, i) => d3.select('#texts').selectAll('text')._groups[0][i].getBBox().width + 4)

	svg.append('g').attr('transform', `translate(0, ${h})`)
	.call( d3.axisTop(scX).ticks(20) )

	svg.append('g')
	.attr('transform', `translate(0, 0)`)
	.call( d3.axisRight(scY).ticks(20) )

}
