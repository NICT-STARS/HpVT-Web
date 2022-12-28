#pragma once
#include <stdio.h>
#include <pthread.h>
/******************************************************************************/
/* Logger                                                                     */
/* Inoue Computer Service                                                     */
/******************************************************************************/
class Logger
{
public:
      Logger();
     ~Logger();
  int Open  (const char* pFileName);
  int Write (const char* pFormat, ...);
  int Close ();

private:
  FILE*           m_file;
  pthread_mutex_t m_mutex;
};

extern Logger g_Logger;
