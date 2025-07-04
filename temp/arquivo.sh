#!/bin/bash

# Texto que você quer digitar
texto="Seu texto aqui"

# Tempo de espera antes de começar a digitar (em segundos)
sleep 2

# Loop para digitar letra por letra
for (( i=0; i<${#texto}; i++ )); do
    letra="${texto:i:1}"
    # Digita a letra usando xdotool
    xdotool type "$letra"
    # Opcional: pequeno delay entre letras para parecer mais natural
    sleep 0.1
done
