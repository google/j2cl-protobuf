package com.google.protobuf.contrib.j2cl.runtime;

import static com.google.common.truth.Truth.assertThat;
import static org.junit.Assert.assertThrows;

import com.google.protobuf.GeneratedMessageLite;
import com.google.protobuf.ProtocolMessageEnum;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.ListIterator;
import java.util.function.Consumer;
import jsinterop.annotations.JsMethod;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/** Tests for GeneratedMessageLite.Internal */
@RunWith(JUnit4.class)
public class InternalTest {

  private enum MyEnum implements ProtocolMessageEnum {
    ONE(1),
    TWO(2),
    THREE(3);

    private int number;

    MyEnum(int number) {
      this.number = number;
    }

    @Override
    public int getNumber() {
      return number;
    }
  }

  private static class LocalListView implements GeneratedMessageLite.Internal_.ListView<String> {

    private final String[] values;

    LocalListView(String... values) {
      this.values = values;
    }

    @Override
    public String get(int index) {
      return values[index];
    }

    @Override
    public int size() {
      return values.length;
    }

    // Overrides the API available in JavaScript but not exposed in Java to avoid warnings.
    @JsMethod
    String[] toArray() {
      throw new UnsupportedOperationException();
    }
  }

  public static List<String> createList(LocalListView listView) {
    return GeneratedMessageLite.Internal_.createList(listView);
  }

  @Test
  public void testUnmodifiableList() {
    List<String> list = createList(new LocalListView("1", "2", "3"));
    doTestModificationsToList(list, "4");
    doTestModificationsToListViaIterator(list, "4");
  }

  @Test
  public void testUnmodifiableList_emptyList() {
    List<String> list = createList(new LocalListView());
    doTestModificationsToList(list, "4");
  }

  private <T> void doTestModificationsToList(List<T> list, T element) {
    assertUnmodifiableContract(list, l -> l.add(element));
    assertUnmodifiableContract(list, l -> l.add(0, element));
    assertUnmodifiableContract(list, l -> l.addAll(Arrays.asList(element)));
    assertUnmodifiableContract(list, l -> l.addAll(0, Arrays.asList(element)));
    assertUnmodifiableContract(list, l -> l.addAll(Arrays.asList()));
    assertUnmodifiableContract(list, l -> l.clear());
    assertUnmodifiableContract(list, l -> l.replaceAll((s) -> element));
    assertUnmodifiableContract(list, l -> l.remove(element));
    assertUnmodifiableContract(list, l -> l.remove(0));
    assertUnmodifiableContract(list, l -> l.removeAll(Arrays.asList(element)));
    assertUnmodifiableContract(list, l -> l.removeIf((s) -> true));
    assertUnmodifiableContract(list, l -> l.retainAll(Arrays.asList(element)));
    assertUnmodifiableContract(list, l -> l.set(0, element));
    assertUnmodifiableContract(list, l -> l.sort((s1, s2) -> s2.hashCode() - s1.hashCode()));
    assertUnmodifiableContract(list, l -> l.subList(0, 0).remove(0));
  }

  private <T> void doTestModificationsToListViaIterator(List<T> list, T element) {
    assertUnmodifiableContractThroughIterator(list, i -> i.add(element));
    assertUnmodifiableContractThroughIterator(list, i -> i.remove());
    assertUnmodifiableContractThroughIterator(list, i -> i.set(element));
  }

  private static <T> void assertUnmodifiableContractThroughIterator(
      List<T> list, Consumer<ListIterator<T>> consumer) {
    assertUnmodifiableContract(
        list,
        l -> {
          ListIterator<T> listIterator = l.listIterator();
          listIterator.next();
          consumer.accept(listIterator);
        });

    assertUnmodifiableContract(
        list,
        l -> {
          ListIterator<T> listIterator = l.listIterator(1);
          listIterator.next();
          consumer.accept(listIterator);
        });
  }

  private static <T> void assertUnmodifiableContract(List<T> list, Consumer<List<T>> consumer) {
    List<?> originalContent = new ArrayList<>(list);
    assertThrows(UnsupportedOperationException.class, () -> consumer.accept(list));
    assertThat(list).containsExactlyElementsIn(originalContent).inOrder();
  }
}
