import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useAppSelector } from 'app/hooks';
import { getIsAuthorized, getUserId, getUserRequestStatus } from 'app/mainSlice';
const AuthPage = lazy(() =>
  import('pages/AuthPage/AuthPage').then(({ AuthPage }) => ({ default: AuthPage }))
);
const RegisterPage = lazy(() =>
  import('pages/RegisterPage/RegisterPage').then(({ RegisterPage }) => ({ default: RegisterPage }))
);
const Page404 = lazy(() =>
  import('pages/Page404/Page404').then(({ Page404 }) => ({ default: Page404 }))
);
const ProcessingPage = lazy(() =>
  import('pages/ProcessingPage/ProcessingPage').then(({ ProcessingPage }) => ({
    default: ProcessingPage,
  }))
);
const UserRoom = lazy(() =>
  import('pages/UserRoom/UserRoom').then(({ UserRoom }) => ({ default: UserRoom }))
);
const UserSettings = lazy(() =>
  import('pages/UserSettings/UserSettings').then(({ UserSettings }) => ({
    default: UserSettings,
  }))
);
const PostPage = lazy(() =>
  import('pages/PostPage/PostPage').then(({ PostPage }) => ({ default: PostPage }))
);
const AllPostsPage = lazy(() =>
  import('pages/AllPostsPage/AllPostsPage').then(({ AllPostsPage }) => ({ default: AllPostsPage }))
);
const MessagesPage = lazy(() =>
  import('pages/MessagesPage/MessagesPage').then(({ MessagesPage }) => ({ default: MessagesPage }))
);

export const useRoutes = (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => {
  const isAuthorized = useAppSelector(getIsAuthorized);
  const userRequestStatus = useAppSelector(getUserRequestStatus);

  const userId = useAppSelector(getUserId);

  return (
    <Suspense fallback={<ProcessingPage />}>
      <Routes>
        {isAuthorized ? (
          <>
            <Route path="/" element={<Navigate to={`/user/${userId}`} />} />
            <Route path="login" element={<Navigate to={`/user/${userId}`} />} />
            <Route path="register" element={<Navigate to={`/user/${userId}`} />} />
            <Route path="user/:id" element={<UserRoom socket={socket} />} />
            <Route path="user/*" element={<UserRoom socket={socket} />} />
            <Route path="settings" element={<UserSettings socket={socket} />} />
            <Route path="/posts/" element={<AllPostsPage socket={socket} />} />
            <Route path="/posts/:id" element={<PostPage socket={socket} />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route
              path="*"
              element={userRequestStatus === 'loading' ? <ProcessingPage /> : <Page404 />}
            />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to={'/login'} />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<AuthPage />} />
            <Route
              path="*"
              element={userRequestStatus === 'loading' ? <ProcessingPage /> : <Page404 />}
            />
          </>
        )}
      </Routes>
    </Suspense>
  );
};
