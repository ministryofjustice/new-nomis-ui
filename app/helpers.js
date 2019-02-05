import qs from 'querystring'

export const linkOnClick = handlerFn => {
  if (!handlerFn) return null

  return {
    tabIndex: 0,
    role: 'link',
    onClick: handlerFn,
    onKeyDown: event => {
      if (event.key === 'Enter') handlerFn(event)
    },
  }
}

export const getQueryParams = queryString => qs.parse(queryString.substr(1))
