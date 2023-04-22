export const getClientById = (clientId, clients) => {
  const clientIndex = clients.findIndex((clientItem) => clientItem.id === clientId)

  return clients[clientIndex]
}
