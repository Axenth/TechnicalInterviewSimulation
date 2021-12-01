NAME = dott

SRC = main.ts

OBJS = $(SRC:.ts=.js)

all: $(NAME)

%.js: %.ts
	tsc $^ 

$(NAME): $(OBJS)
	node $(OBJS)

clean:
	rm -f $(OBJS)
	rm -f $(NAME)

re: clean all

install:
	-curl -fsSL https://deno.land/x/install/install.sh | sh