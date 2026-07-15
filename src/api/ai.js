import request from '@/utils/axios';
export function startChat(data) {
  return request({
    url: '/psychological-chat/session/start',
    method: 'post',
    data
  })
}

export function getSessionList(data) {
  return request({
    url: '/psychological-chat/sessions',
    method: 'get',
    params: data
  })
}

export function deleteSession(sessionId) {
  return request({
    url: `/psychological-chat/sessions/${sessionId}`,
    method: 'delete',
    
  })
}

export function getSessionMessages(sessionId) {
  return request({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
    method: 'get',
    // params: sessionId
  })
}
