# Obsidian Metronome 🎵

Use this plugin to add interactive metronomes to your notes. Use just the visual metronome or turn on a click or beep. Customize the tempo, meter, sound, size, and more. Pair it with [obsidian-plugin-abcjs](https://github.com/TilBlechschmidt/obsidian-plugin-abcjs) to have your score and metronome living in harmony in a single note! 🎵

![Kiku](images/demo-1.gif)

## Why?

I use [obsidian-plugin-abcjs](https://github.com/TilBlechschmidt/obsidian-plugin-abcjs) for writing out music notation in Obsidian and sometimes during live performances I have a need to know what tempo to play a song. This plugin provides a visual metronome that I can have right alongside my music that serves as a great reminder of the correct tempo for a live performance. During practice, I can unmute it and practice alongside it as it clicks on the beat.

## Getting Started

1. In Obsidian, go to Settings > Community Plugins and disable safe mode if it is enabled.
1. Select **Browse** and search for the **Metronome** plugin.
1. Install the plugin.
1. Enable the plugin.
1. Open a note and place a code block in your note like the one below. Give it a `bpm` ([beats per minute](https://en.wikipedia.org/wiki/Tempo)) for your tempo. In the example below, I've set `bpm` to `120`.

````markdown
# My basic metronome

```metronome
bpm: 120
```
````

This produces a visual metronome in your note. By default it is muted, but you can press the unmute button to hear it click (or change the `muted` option so it clicks by default &mdash; see below for more options).

![Kiku](images/demo-2.gif)

You can customize the metronome further:

````markdown
# My more fancy metronome

```metronome
bpm: 120
meter: 12/8
size: large
sound: beep
beepTick: A5
beepTock: A4
```
````

![](images/demo-3.gif)

## Metronome Options

These are all the options you can change when creating a metronome. Only the `bpm` option is required.

| Option      | Type                          | Description                                                                                                                                                                                                                                                                | Default    |
| ----------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `bpm`       | number                        | Tempo in [beats per minute](https://en.wikipedia.org/wiki/Tempo). Must be greater than 0.                                                                                                                                                                                  | (required) |
| `meter`     | string                        | The [time signature](https://en.wikipedia.org/wiki/Time_signature) (meter) to play in. The bottom number must be 1, 2, 4, 8, 16, 32, or 64. Examples: 4/4, 3/4, 6/8, 12/8.                                                                                                 | `4/4`      |
| `muted`     | `yes` or `no`                 | Whether or not the metronome's audio starts muted.                                                                                                                                                                                                                         | `yes`      |
| `autoStart` | `yes` or `no`                 | Whether or not the metronome starts flashing visually right away. If `autoStart` is `yes` and `muted` is `no`, then the metronome's sound will also start playing immediately.                                                                                             | `yes`      |
| `size`      | `small`, `medium`, or `large` | Control the size of the metronome in the note.                                                                                                                                                                                                                             | `small`    |
| `sound`     | `click` or `beep`             | Control whether the metronome clicks or beeps when unmuted.                                                                                                                                                                                                                | `click`    |
| `beepTick`  | string                        | When `sound` is set to `beep`, this determines the pitch of the **downbeat**, specified in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation). (For example, middle C is C4.) If there is no meter, every beat is considered a downbeat. | `C6`       |
| `beepTock`  | string                        | When `sound` is set to `beep`, this determines the pitch of the **upbeat**, specified in [scientific pitch notation](https://en.wikipedia.org/wiki/Scientific_pitch_notation). (For example, middle C is C4.) If there is no meter, every beat is considered a downbeat.   | `C5`       |

## Examples

### Small metronome in 6/8 time that does not autostart

Looks great in dark mode too!

![](images/demo-4.gif)

### Include alongside music notation

The metronome works great when placed alongside music notation using the [obsidian-plugin-abcjs](https://github.com/TilBlechschmidt/obsidian-plugin-abcjs) plugin.

![](images/demo-5.gif)
