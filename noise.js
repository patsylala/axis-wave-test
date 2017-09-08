/**
 *
 * noise.js
 * Loop noise generation based on cosine interpolation and the simplex algorithm
 * @author Jerson La Torre (https://github.com/jerson-latorre) - 2016
 *
 */

class Noise
{
	constructor(loopLength = 10, seed = 12345)
	{
		this.length = loopLength
		this.seed = 0
		this.initialSeed = Math.floor(seed)
		this._permutate()
	}

	value(x, y = 0)
	{
		let auxX = (x + y)
		let auxY = (y - x) 

		let Gx = this._mod(Math.floor(auxX), this.length) // grid X
		let Gy = this._mod(Math.floor(auxY), this.length) // grid Y
		let tx = auxX - Math.floor(auxX) // relative t in the grid
		let ty = auxY - Math.floor(auxY) // relative t in the grid

		let G11 =  this.permutation[Gx][Gy]
		let G21 =  this.permutation[Gx][(Gy + 1) % this.length]
		let G12 =  this.permutation[(Gx + 1) % this.length][Gy]
		let G22 =  this.permutation[(Gx + 1) % this.length][(Gy + 1) % this.length]

		let u = this._lerp(G11, G12, this._fade(tx))
		let v = this._lerp(G21, G22, this._fade(tx))
		let w = this._lerp(u, v, this._fade(ty))

		return w
	}

	_randomseed()
	{
		let r = Math.sin(this.seed++) * 10000
		return r - Math.floor(r)
	}

	_permutate()
	{
		let n = this.length
		let aux = []
		for (let i = 0; i < n * n; i++) aux[i] = i / (n * n - 1)
		this._shuffle(aux, this.initialSeed)

		let value = 0
		this.permutation = []

		for (let i = 0; i < n; i++)
		{
			this.permutation[i] = []
			for (let j = 0; j < n; j++) this.permutation[i].push(aux[value++])
			this._shuffle(this.permutation[i], this.initialSeed)
		}

		this._shuffle(this.permutation, this.initialSeed)
	}

	_shuffle(array, seed)
	{
		this.seed = seed

		for (var i = array.length - 1; i > 0; i--)
		{
			var j = Math.floor(this._randomseed() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	  
		return array;
	}

	_lerp(a, b, t)
	{
		return a + (b - a) * t
	}

	_fade(t)
	{
		return 0.5 * (1 - Math.cos(t * 3.14))
	}

	_mod(m, n)
	{
		return ((m % n) + n) % n
	}
}
