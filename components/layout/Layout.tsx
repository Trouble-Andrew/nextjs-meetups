import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';

interface LayoutProps extends React.ComponentPropsWithoutRef<'main'> {}

function Layout(props: LayoutProps) {
  return (
    <div>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
