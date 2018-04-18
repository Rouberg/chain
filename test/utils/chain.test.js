import chain from 'src/chain'
import {testData as testDataSource} from '../typeTestData'
import '../extend/toBeFunction'
const testData = testDataSource.filter(item => item.type !== 'function')

describe('#utils/chain', () => {
  describe('basic test', () => {
    it('fn return value, chain return a promise', done => {
      const fn = jest.fn()
      const data = 'value'
      fn.mockReturnValue(data)
      const result = chain(fn)
      expect(result instanceof Promise).toBeTruthy()
      result.then(value => {
        expect(fn.mock.calls.length).toBe(1)
        expect(value).toEqual(data)
        done()
      })
    })

    it('fn resolve value, chain return a promise', done => {
      const fn = jest.fn()
      const data = 'value'
      fn.mockResolvedValue(data)
      const result = chain(fn)
      expect(result instanceof Promise).toBeTruthy()
      result.then(value => {
        expect(fn.mock.calls.length).toBe(1)
        expect(value).toEqual(data)
        done()
      })
    })

    it('fn reject reason, chain return a promise', done => {
      const fn = jest.fn()
      const reason = 'reason'
      fn.mockRejectedValue(reason)
      chain.rejected = jest.fn()
      const result = chain(fn)
      expect(result instanceof Promise).toBeTruthy()
      result.finally(() => {
        expect(chain.rejected.mock.calls.length).toBe(1)
        expect(chain.rejected.mock.calls[0][0]).toBe(reason)
        done()
      })
    })

    it('call once only', done => {
      const fn = jest.fn()
      const result = chain(fn)
      result.then(() => {
        expect(fn.mock.calls.length).toBe(1)
        done()
      })
    })
    it('call without arguments', done => {
      const fn = jest.fn()
      const result = chain(fn)
      result.then(() => {
        expect(fn.mock.calls[0][0]).toBeUndefined()
        done()
      })
    })
  })

  describe('single fn call', () => {
    it('when fn resolve value, call result get it', done => {
      const fn = jest.fn()
      const data = {h: 1, g: true}
      fn.mockResolvedValue(data)
      chain(fn).then(value => {
        expect(value).toEqual(data)
        done()
      })
    })

    it('when fn return value, call result get it', done => {
      const fn = jest.fn()
      const data = {h: 1, g: true}
      fn.mockReturnValue(data)
      chain(fn).then(value => {
        expect(value).toEqual(data)
        done()
      })
    })
  })

  describe('call with data', () => {
    testData.forEach(item => {
      it(`in chain(${item.name}, fn), fn is call with right data`, done => {
        const fn = jest.fn()
        const result = chain(item.value, fn)
        expect(result instanceof Promise).toBeTruthy()
        result.then(() => {
          expect(fn.mock.calls.length).toBe(1)
          expect(fn.mock.calls[0][0]).toEqual(item.value)
          done()
        })
      })
    })
  })

  describe('serial call', () => {
    it('prev fn resolved, next fn pick it', done => {
      const prev = jest.fn()
      const next = jest.fn()
      const data = {h: 1, g: true}
      prev.mockResolvedValue(data)
      chain(prev, next).then(() => {
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0]).toEqual(data)
        done()
      })
    })

    it('prev fn return, next fn get it', done => {
      const prev = jest.fn()
      const next = jest.fn()
      const data = {h: 1, g: true}
      prev.mockReturnValue(data)
      chain(prev, next).then(() => {
        expect(next.mock.calls.length).toBe(1)
        expect(next.mock.calls[0][0]).toEqual(data)
        done()
      })
    })

    it('when prev rejected, remain never called', done => {
      const a = jest.fn()
      const b = jest.fn()
      const c = jest.fn()
      const rejectMsg = 'stop required!'
      a.mockRejectedValue(rejectMsg)
      chain.rejected = jest.fn()
      const result = chain(a, b, c)
      expect(result instanceof Promise).toBeTruthy()
      result.then(() => {
        expect(chain.rejected.mock.calls[0][0]).toBe(rejectMsg)
        expect(a.mock.calls.length).toBe(1)
        expect(b.mock.calls.length).toBe(0)
        expect(c.mock.calls.length).toBe(0)
        done()
      })
    })

    it('call one by one as expected', done => {
      const a = jest.fn()
      const b = jest.fn()
      const c = jest.fn()
      const d = jest.fn()
      const e = jest.fn()
      a.mockResolvedValue('a')
      b.mockResolvedValue('b')
      c.mockReturnValue('c')
      d.mockReturnValue('d')
      e.mockResolvedValue('e')
      const result = chain(a, b, c, d, e)
      expect(result instanceof Promise).toBeTruthy()
      result.then(value => {
        expect(a.mock.calls.length).toBe(1)
        expect(b.mock.calls.length).toBe(1)
        expect(c.mock.calls.length).toBe(1)
        expect(d.mock.calls.length).toBe(1)
        expect(e.mock.calls.length).toBe(1)
        expect(b.mock.calls[0][0]).toBe('a')
        expect(c.mock.calls[0][0]).toBe('b')
        expect(d.mock.calls[0][0]).toBe('c')
        expect(e.mock.calls[0][0]).toBe('d')
        expect(value).toBe('e')
        done()
      })
    })
  })

  describe('parallel call', () => {
    it('merge call result as expected', done => {
      const a = jest.fn()
      const b = jest.fn()
      const c = jest.fn()
      a.mockResolvedValue('a')
      b.mockResolvedValue('b')
      c.mockResolvedValue('c')
      const result = chain([a, b], c)
      expect(result instanceof Promise).toBeTruthy()
      result.then(value => {
        expect(value).toBe('c')
        expect(a.mock.calls.length).toBe(1)
        expect(b.mock.calls.length).toBe(1)
        expect(c.mock.calls.length).toBe(1)
        expect(c.mock.calls[0][0]).toEqual(['a', 'b'])
        done()
      })
    })

    it('with data as expected', done => {
      const a = jest.fn()
      const b = jest.fn()
      const c = jest.fn()
      const d = jest.fn()
      const e = jest.fn()
      const data1 = 'data1'
      const data2 = 'data2'
      a.mockResolvedValue('a')
      b.mockReturnValue('b')
      c.mockResolvedValue('c')
      d.mockResolvedValue('d')
      e.mockResolvedValue('e')
      const result = chain([[data1, a], [data2, b, c], d], e)
      expect(result instanceof Promise).toBeTruthy()
      result.then(value => {
        expect(a.mock.calls.length).toBe(1)
        expect(b.mock.calls.length).toBe(1)
        expect(c.mock.calls.length).toBe(1)
        expect(d.mock.calls.length).toBe(1)
        expect(e.mock.calls.length).toBe(1)
        expect(a.mock.calls[0][0]).toEqual(data1)
        expect(b.mock.calls[0][0]).toEqual(data2)
        expect(c.mock.calls[0][0]).toEqual('b')
        expect(e.mock.calls[0][0]).toEqual(['a', 'c', 'd'])
        expect(value).toEqual('e')
        done()
      })
    })

    it('when prev rejected, remain never called', done => {
      const a = jest.fn()
      const b = jest.fn()
      const c = jest.fn()
      const d = jest.fn()
      const e = jest.fn()
      const rejectMsg = 'b'
      a.mockResolvedValue('a')
      b.mockRejectedValue(rejectMsg)
      chain.rejected = jest.fn()
      const result = chain([a, b], c, d, e)
      expect(result instanceof Promise).toBeTruthy()
      result.then(() => {
        expect(chain.rejected.mock.calls[0][0]).toBe(rejectMsg)
        expect(a.mock.calls.length).toBe(1)
        expect(b.mock.calls.length).toBe(1)
        expect(c.mock.calls.length).toBe(0)
        expect(d.mock.calls.length).toBe(0)
        expect(e.mock.calls.length).toBe(0)
        done()
      })
    })
  })
})
