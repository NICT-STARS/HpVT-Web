#pragma once
#include <sys/select.h>
typedef int SOCKET;
/******************************************************************************/
/* Socket                                                                     */
/* Inoue Computer Service                                                     */
/******************************************************************************/
class Socket
{
public:
           Socket         ();
          ~Socket         ();
  bool     CreateSocket   ();
  int      CloseSocket    ();
  int      Bind           (const int pPort);
  int      Listen         ();
  Socket*  Accept         ();
  int      Recv           (char*       pValue,       int pSize);
  int      Send           (const char* pValue, const int pSize);
  int      Shutdown       (int pHow);
  bool     IsInvalidSocket();
  int      GetError       ();
  SOCKET   GetSocket      ();
  int      Select         (int nfds, fd_set* readfds, fd_set* writefds, fd_set* exceptfds, struct timeval* timeout);

private:
  SOCKET   m_socket;
};
