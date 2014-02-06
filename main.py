import endpoints

from google.appengine.ext import ndb
from protorpc import remote

from endpoints_proto_datastore.ndb import EndpointsModel


class Todo(EndpointsModel):
  _message_fields_schema = ('id', 'text', 'done', 'created')

  text = ndb.StringProperty(indexed=False)
  done = ndb.BooleanProperty(default=False)
  created = ndb.DateTimeProperty(auto_now_add=True)


@endpoints.api(name='todo', version='v1', description='REST API for Todos')
class TodoV1(remote.Service):

  @Todo.method(path='todos/{id}', http_method='GET', name='todos.get')
  def TodoGet(self, todo):
    if not todo.from_datastore:
      raise endpoints.NotFoundException('Todo not found.')
    return todo

  @Todo.method(path='todos/{id}', http_method='DELETE', name='todos.remove')
  def TodoRemove(self, todo):
    if not todo.from_datastore:
      raise endpoints.NotFoundException('Todo not found.')
    todo.key.delete()
    return todo

  @Todo.method(path='todos', http_method='POST', name='todos.insert')
  def TodoInsert(self, todo):
    todo.put()
    return todo

  @Todo.method(path='todos/{id}', http_method='PUT', name='todos.update')
  def TodoUpdate(self, todo):
    todo.put()
    return todo

  @Todo.query_method(path='todos', name='todos.list')
  def TodoList(self, query):
    return query


application = endpoints.api_server([TodoV1], restricted=False)
