import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.optimizers import Adam

COLOR_DICTIONARY = {
    'vermelho': [230, 25, 25],
    'amarelo': [245, 220, 50],
    'azul': [40, 100, 230],
    'laranja': [250, 140, 30],
    'verde': [60, 180, 75],
    'roxo': [150, 60, 180],
}

colors = np.array(list(COLOR_DICTIONARY.values())) / 255.0
labels = np.array(list(COLOR_DICTIONARY.keys()))

label_to_index = {label: i for i, label in enumerate(labels)}
y = np.array([label_to_index[label] for label in labels])
y_cat = to_categorical(y)

def add_noise(data, noise_level=0.05, samples_per_color=200):
    X, Y = [], []
    for i, base_color in enumerate(data):
        for _ in range(samples_per_color):
            noisy = base_color + np.random.uniform(-noise_level, noise_level, 3)
            noisy = np.clip(noisy, 0, 1)
            X.append(noisy)
            Y.append(i)
    return np.array(X), to_categorical(Y)

X_train, y_train = add_noise(colors)

model = Sequential([
    Dense(16, input_shape=(3,), activation='relu'),
    Dense(16, activation='relu'),
    Dense(len(labels), activation='softmax')
])

model.compile(optimizer=Adam(0.01), loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(X_train, y_train, epochs=100, batch_size=32, verbose=1)

model.save('color_model.h5')

print("\nTreinamento concluído!")
print("Modelo salvo em 'color_model.h5'")
print("Labels:", label_to_index)
