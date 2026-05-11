import '@testing-library/jest-dom';
import { data } from '@/data';
import { TrackType } from '@/sharedTypes/sharedTypes';
import TrackList from './Tracklist';
import ReduxProvider from '@/store/ReduxProvider';
import { render, screen } from '@testing-library/react';
import { formatTime } from '@/utils/helper';

const mockTracks: TrackType[] = data;
const mockTrack: TrackType = data[0];

describe('Track component', () => {
  test('Отрисовка данных трека', () => {
    render(
      <ReduxProvider>
        <TrackList track={mockTrack} tracks={mockTracks} />
      </ReduxProvider>,
    );
    expect(screen.getAllByText(mockTrack.author).length).toBeGreaterThan(0);
    expect(screen.getAllByText(mockTrack.name).length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(formatTime(mockTrack.duration_in_seconds)).length,
    ).toBeGreaterThan(0);
  });
});
