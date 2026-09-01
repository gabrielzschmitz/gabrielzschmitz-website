#!/usr/bin/env sh
set -e

zola build

perl -0777 -e '
  my ($docfile, $cssfile) = @ARGV;
  open my $fh, "<", $docfile or die "cannot open $docfile: $!";
  my $doc = do { local $/; <$fh> };
  close $fh;
  open my $cf, "<", $cssfile or die "cannot open $cssfile: $!";
  my $css = do { local $/; <$cf> };
  close $cf;

  my $pat = qr{
    <link\b[^>]*\bhref=["\x27]?\./assets/css/main\.css["\x27]?[^>]*\brel=["\x27]?stylesheet["\x27]?[^>]*>
    |<link\b[^>]*\brel=["\x27]?stylesheet["\x27]?[^>]*\bhref=["\x27]?\./assets/css/main\.css["\x27]?[^>]*>
  }ix;

  my $n = () = $doc =~ s{$pat}{<style>\n$css\n</style>}g;
  die "stylesheet link not found in $docfile\n" unless $n >= 1;

  open my $of, ">", $docfile or die "cannot write $docfile: $!";
  print $of $doc;
  close $of;
  print "inlined $cssfile ($n link) into $docfile\n";
' public/index.html static/assets/css/main.css