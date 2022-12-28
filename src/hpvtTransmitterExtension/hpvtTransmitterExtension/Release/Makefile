CFLAGS  = -c -O3 -Wall
LFLAGS  = -Wall -L../CISVCC/lib -L../SSCClient/lib -L../cJSON/lib
LDFLAGS = -lopencv_core -lopencv_highgui -lopencv_imgproc -lm -lcisvcc -lcurl -lsscclient -lcjson
OBJS    = main.o Logger.o Config.o Socket.o SocketConnecter.o SocketSender.o SSCClientManager.o
TARGET  = ../../Release/hpvtTransmitterExtension.so

all:: $(TARGET)

%.o: ../%.c ../%.h
	@rm -f $@
	gcc $(CFLAGS) $< -o $@

%.o: ../%.cpp ../%.h
	@rm -f $@
	g++ $(CFLAGS) $< -o $@

$(TARGET): $(OBJS)
	g++ -shared $(LFLAGS) -o $@ $(OBJS) $(LDFLAGS)

clean::
	rm -f $(OBJS) $(TARGET)
