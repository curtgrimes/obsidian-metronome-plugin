# Obsidian Metronome

Use this plugin to add interactive metronomes to your notes. Customize the tempo, meter, sound, and more. Pair it with [obsidian-plugin-abcjs](https://github.com/TilBlechschmidt/obsidian-plugin-abcjs) to have your score and metronome in one note!

## Getting Started

1. In Obsidian, go to Settings > Community Plugins and disable safe mode if it is enabled.
1. Select Browse and search for the **Metronome** plugin.
1. Install the plugin.
1. Enable the plugin.
1. Open a note place a code block in your note like the one below. Specify a `bpm` ([beats per minute](https://en.wikipedia.org/wiki/Tempo)) as your tempo.

````markdown
# My basic metronome

```metronome
bpm: 120
```
````

This produces a visual metronome in your note. You can press the unmute button to hear it click.

You can customize the metronome further:

````markdown
# My more fancy metronome

```metronome
bpm: 120
meter: 3/4
size: large
sound: beep
beepTick: A5
beepTock: A4
```
````

[picture]

## Metronome Options

These are all the options you can change when creating a metronome. Only `bpm` is required.

| Option  | Type   | Description                                                                                                                                 | Default    |
| ------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `bpm`   | number | Tempo in [beats per minute](https://en.wikipedia.org/wiki/Tempo)                                                                            | (required) |
| `meter` | string | The [time signature](https://en.wikipedia.org/wiki/Time_signature) (meter) to play in. The bottom number must be 1, 2, 4, 8, 16, 32, or 64. | 4/4        |
