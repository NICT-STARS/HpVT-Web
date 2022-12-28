#include <string.h>
#include <stdlib.h>
#include <stdarg.h>
#include <sys/time.h>
#include "Logger.h"
/******************************************************************************/
/* Logger                                                                     */
/* Inoue Computer Service                                                     */
/******************************************************************************/
/******************************************************************************/
/* Constructor                                                                */
/******************************************************************************/
Logger::Logger()
{
  m_file = stdout;
  pthread_mutex_init(&m_mutex, NULL);
}
/******************************************************************************/
/* Destructor                                                                 */
/******************************************************************************/
Logger::~Logger()
{
  pthread_mutex_destroy(&m_mutex);
}
/******************************************************************************/
/* Open                                                                       */
/******************************************************************************/
int Logger::Open(const char* pFileName)
{
  m_file = fopen(pFileName, "w");
  return m_file == NULL ? -1 : 0;
}
/******************************************************************************/
/* Write                                                                      */
/******************************************************************************/
int Logger::Write(const char* pFormat, ...)
{
  pthread_mutex_lock (&m_mutex);

  char*          strFormat;
  char           strTime[52]; // "[hpvtTransmitterExtension] yyyy/mm/dd HH:MM:SS.NNN "
  va_list        objArgs;
  int            intResult;

  strFormat = (char*)malloc(52 + strlen(pFormat));

  struct timeval objTimeVal;
  struct tm*     objTime;
  gettimeofday(&objTimeVal, NULL);
  objTime = localtime(&objTimeVal.tv_sec);
  sprintf  (strTime, "[hpvtTransmitterExtension] %04d/%02d/%02d %02d:%02d:%02d.%03d ", objTime->tm_year + 1900, objTime->tm_mon + 1, objTime->tm_mday, objTime->tm_hour, objTime->tm_min, objTime->tm_sec, (int)(objTimeVal.tv_usec / 1000));

  memcpy  (strFormat     , strTime, 51);
  memcpy  (strFormat + 51, pFormat, strlen(pFormat) + 1);
  va_start(objArgs, pFormat);

  intResult = vfprintf(m_file, strFormat, objArgs);

  va_end              (objArgs);
  free                (strFormat);
  pthread_mutex_unlock(&m_mutex);

  return intResult;
}
/******************************************************************************/
/* Close                                                                      */
/******************************************************************************/
int Logger::Close()
{
  return fclose(m_file);
}
